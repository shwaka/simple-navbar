import assert from "node:assert/strict"
import test from "node:test"

import React from "react"
import { renderToString } from "react-dom/server"

import { createNavBarRoutes } from "../dist/index.mjs"

const rootPageElement = React.createElement("main", null, "Root")
const subpageElement = React.createElement("main", null, "Subpage")
const baseArgs = {
  rootPageElement,
  subpageRoutes: [
    {
      path: "/subpage",
      element: subpageElement,
      name: "Subpage",
    },
  ],
  siteTitle: "Test",
  footerDisplay: "none",
}

function getPageRoutes(args = {}) {
  const routes = createNavBarRoutes({ ...baseArgs, ...args })
  assert.equal(routes.length, 1)
  assert.ok(routes[0].children)
  return routes[0].children
}

test("leaves page elements unchanged when pageSuspense is omitted", () => {
  const pageRoutes = getPageRoutes()

  assert.equal(pageRoutes[0].path, "/")
  assert.equal(pageRoutes[0].element, rootPageElement)
  assert.equal(pageRoutes[1].path, "/subpage")
  assert.equal(pageRoutes[1].element, subpageElement)
})

test("leaves page elements unchanged when pageSuspense is disabled", () => {
  const pageRoutes = getPageRoutes({
    pageSuspense: { enabled: false },
  })

  assert.equal(pageRoutes[0].element, rootPageElement)
  assert.equal(pageRoutes[1].element, subpageElement)
})

test("wraps every page in a separate Suspense boundary", () => {
  const fallback = React.createElement("p", null, "Loading")
  const pageRoutes = getPageRoutes({
    pageSuspense: { enabled: true, fallback },
  })
  const rootBoundary = pageRoutes[0].element
  const subpageBoundary = pageRoutes[1].element

  assert.equal(rootBoundary.type, React.Suspense)
  assert.equal(rootBoundary.props.fallback, fallback)
  assert.equal(rootBoundary.props.children, rootPageElement)
  assert.equal(rootBoundary.key, "/")
  assert.equal(subpageBoundary.type, React.Suspense)
  assert.equal(subpageBoundary.props.fallback, fallback)
  assert.equal(subpageBoundary.props.children, subpageElement)
  assert.equal(subpageBoundary.key, "/subpage")
  assert.notEqual(rootBoundary, subpageBoundary)
})

test("preserves the existing structure when deferInitialRender is omitted", () => {
  const fallback = React.createElement("p", null, "Loading")
  const pageRoutes = getPageRoutes({
    pageSuspense: { enabled: true, fallback },
  })

  assert.equal(pageRoutes[0].element.props.children, rootPageElement)
  assert.equal(pageRoutes[1].element.props.children, subpageElement)
})

test("defers the initial render of subpages with the shared fallback", () => {
  const fallback = React.createElement("p", null, "Loading")
  const preload = async () => undefined
  const pageRoutes = getPageRoutes({
    subpageRoutes: [
      {
        path: "/subpage",
        element: subpageElement,
        name: "Subpage",
        preload,
      },
    ],
    pageSuspense: {
      enabled: true,
      fallback,
      deferInitialRender: true,
    },
  })
  const rootBoundary = pageRoutes[0].element
  const subpageBoundary = pageRoutes[1].element
  const gate = subpageBoundary.props.children

  assert.equal(rootBoundary.props.children, rootPageElement)
  assert.equal(subpageBoundary.props.fallback, fallback)
  assert.equal(gate.props.enabled, true)
  assert.equal(gate.props.fallback, fallback)
  assert.equal(gate.props.preload, preload)
  assert.equal(gate.props.children, subpageElement)
  assert.match(renderToString(subpageBoundary), /Loading/)
  assert.doesNotMatch(renderToString(subpageBoundary), /Subpage/)
})

test("supports deferred subpages without a preload function", () => {
  const fallback = React.createElement("p", null, "Loading")
  const pageRoutes = getPageRoutes({
    pageSuspense: {
      enabled: true,
      fallback,
      deferInitialRender: true,
    },
  })
  const gate = pageRoutes[1].element.props.children

  assert.equal(gate.props.preload, undefined)
  assert.equal(gate.props.children, subpageElement)
})

test("uses the built-in element for the default fallback", () => {
  const pageRoutes = getPageRoutes({
    pageSuspense: { enabled: true, fallback: "default" },
  })
  const boundary = pageRoutes[0].element

  assert.equal(boundary.type, React.Suspense)
  assert.notEqual(boundary.props.fallback, "default")
  assert.ok(React.isValidElement(boundary.props.fallback))
})

test("keeps the built-in spinner width stable under heavy load", async () => {
  const LazyPage = React.lazy(() => new Promise(() => undefined))
  const pageRoutes = getPageRoutes({
    subpageRoutes: [
      {
        path: "/lazy",
        element: React.createElement(LazyPage),
        name: "Lazy page",
      },
    ],
    pageSuspense: { enabled: true, fallback: "default" },
  })

  assert.match(
    renderToString(pageRoutes[1].element),
    /MuiCircularProgress-circleDisableShrink/,
  )
})

test("shows the fallback until a lazy page module resolves", async () => {
  let resolvePage
  const LazyPage = React.lazy(() => new Promise((resolve) => {
    resolvePage = resolve
  }))
  const fallback = React.createElement("p", null, "Loading page")
  const pageRoutes = getPageRoutes({
    subpageRoutes: [
      {
        path: "/lazy",
        element: React.createElement(LazyPage),
        name: "Lazy page",
      },
    ],
    pageSuspense: { enabled: true, fallback },
  })

  assert.match(renderToString(pageRoutes[1].element), /Loading page/)

  resolvePage({
    default: () => React.createElement("p", null, "Lazy page loaded"),
  })
  await new Promise((resolve) => setTimeout(resolve, 0))

  assert.match(renderToString(pageRoutes[1].element), /Lazy page loaded/)
})
