# Design, Carbon, and the Styleguide

## Design Patterns in OpenMRS 3.x

First, review these introduction materials that explain the patterns to follow to keep OpenMRS 3.x a consistent User Experience:

👉  [**Click here to see the 3.x Design Patterns**](https://scene.zeplin.io/project/61434fa756474d5545f65cf4) 👈

Key areas that all Developers and Project Managers/BA team members should be most familiar with are:

* [NavBar/Header](https://scene.zeplin.io/project/61434fa756474d5545f65cf4/screen/6143628f56474d5545f6fce0)
* [Side Rail](https://scene.zeplin.io/project/61434fa756474d5545f65cf4/screen/614362c96abfb0557aa9e357)
* [Workspace](https://scene.zeplin.io/project/61434fa756474d5545f65cf4/screen/614363d860459a20f7936333)
* [Side Panel](https://scene.zeplin.io/project/61434fa756474d5545f65cf4/screen/614363d8b8582a2b4c3365a2)
* [Data Tables](https://scene.zeplin.io/project/61434fa756474d5545f65cf4/screen/61436254475da3542a84b400)

## What is Carbon?

**Carbon**, or [Carbon Design System](https://www.carbondesignsystem.com/), is an open-source design system with working code, design tools and resources, human interface guidelines, and a community of contributors.

OpenMRS 3.0 uses Carbon to create a unified UI. Third party Design Systems like Carbon are kept professionally maintained by another community which reduces work for OpenMRS contributors. (More details in the [Why Use a Style Guide or a Design System](#why-use-a-style-guide-or-a-design-system) section below.

## How to Use Carbon in OpenMRS 3.0

* See [Getting Started with Carbon](https://www.carbondesignsystem.com/developing/get-started/) for first steps, dev resources, and a React-specific tutorial.
* More Carbon resources are available on [GitHub here](https://github.com/carbon-design-system/carbon).

## How to Use Zeplin

**Zeplin** is a design collaboration tool that facilitates prototyping between UI designers and frontend developers. OpenMRS uses Zeplin for two purposes:

1. *Design Handover*: To share designs as community assets.
2. *Style Guide*: To clearly communicate the OpenMRS 3.0 frontend components, spacing and layout, color palette, and text styles (since Carbon Design doesn't automatically customize all these for us).

### To see the designs anytime

You can see the designs anytime (without creating a Zeplin account) by accessing these public links:

* [Patient Chart designs](https://zpl.io/aNYmqeN)
* [OHRI package designs](https://zpl.io/aMXW7e7)
* [Offline Patient Follow-up designs](https://zpl.io/amRdKomv)

### To use the designs and the styleguide

First, watch this video guide for Developers on how to use Zeplin:

[![How to see UX & component guidance in Zeplin designs](https://img.youtube.com/vi/SjluEGDH4LU/0.jpg)](https://www.youtube.com/watch?v=SjluEGDH4LU&feature=youtu.be&ab_channel=OpenMRS "OpenMRS 3.0: Zeplin Intro for New OpenMRS Devs")

To use the designs as a developer, you'll need to request Zeplin access from an OpenMRS admin; then, you can find them here:

[OpenMRS Zeplin Project](https://app.zeplin.io/workspace/60d4d9bc220676b218e75ed2/projects?pid=60d59321e8100b0324762e05)

You can find re-useable shared components & more at the [OpenMRS Styleguide here](https://app.zeplin.io/project/60d5947dd636aebbd63dce4c/styleguide/components).

## Why use a Style Guide or a Design System?

Users want a consistent, professional front-end UI. Without a style guide, 
the expectations for various UI elements are unclear. This can create a messy, 
inconsistent user experience. This is especially important in medical software: 
end users want confidence in a professional system, and the UI is the user's 
first encounter with that system. A poor UI can damage users' trust and can 
slow down staff workflows. 

A shared, clear Design System helps to

* assure consistency among frontend contributors in the UI look and feel for users
* use precious technical time focusing on engineering work and on the clinical use/workflows, rather than having to spend time on the details of how widgets should look and behave
* make it faster for developers to contribute new features that add value for end users

A **design system** is a guide for making decisions about how interfaces should look, how they should be structured, and the patterns according to which user experiences  are structured. Style Guides like Bootstrap and Material typically don’t provide this  kind of detail. We wanted a Style Guide that would also link to code you'll use in your actual code base.

Learn more about [Why we chose Carbon](https://wiki.openmrs.org/x/uAwGDg) as our design system.
