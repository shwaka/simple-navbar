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

test("uses the built-in element for the default fallback", () => {
  const pageRoutes = getPageRoutes({
    pageSuspense: { enabled: true, fallback: "default" },
  })
  const boundary = pageRoutes[0].element

  assert.equal(boundary.type, React.Suspense)
  assert.notEqual(boundary.props.fallback, "default")
  assert.ok(React.isValidElement(boundary.props.fallback))
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
