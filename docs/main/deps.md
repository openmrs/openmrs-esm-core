# Build-time and Runtime Dependencies

In a frontend modules architecture, different JavaScript applications
come together on the client in a coordinated way. Each application
reaches the client as one or more *bundles*. A bundle is the built
code, transpiled and compiled into a format the browser can read.

An application's dependencies can be *built into the bundle*, or
they can be kept as references and *resolved
on the client*. We refer to these as **build-time dependencies**
and **runtime dependencies**, respectively.

> **For the curious:** The client has to know how to resolve runtime
  dependencies. This is the role of SystemJS and the import map.
  SystemJS tells the browser how to use the import map to resolve
  runtime dependencies. Frontend modules are then compiled into a
  format that tell the browser to use SystemJS for runtime
  dependency resolution.

**Build-time dependencies go in `devDependencies`**, alongside
development tooling.

**Runtime dependencies go in `peerDependencies`**.

<!-- What goes in `dependencies`? There's often stuff there... -->
