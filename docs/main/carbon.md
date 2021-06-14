# Using Carbon and the Styleguide

## What is Carbon?
**Carbon**, or [Carbon Design System](https://www.carbondesignsystem.com/), is an 
open-source design system with working code, design tools and resources, human 
interface guidelines, and a community of contributors. 

OpenMRS 3.0 uses Carbon to create a unified UI. Third party Design Systems like Carbon 
are kept professionally maintained by another community which reduces work for OpenMRS 
contributors. (More details below in the section *Why use a Style Guide or a Design System?*)

## How to Use Carbon in OpenMRS 3.0
* See [Getting Started with Carbon](https://www.carbondesignsystem.com/developing/get-started/)
  for first steps, dev resources, and a react-specific tutorial. 
* More Carbon resources are availble on [GitHub here](https://github.com/carbon-design-system/carbon).

## How to Use Zeplin
**Zeplin** is a webapp tool that helps designs be handed over to developers. OpenMRS uses Zeplin for two purposes:
1. *Design Handover*: To share designs as community assets.
2. *Style Guide*: To clearly communicate the OpenMRS 3.0 frontend components, spacing 
    and layout, color palette, and text styles (since Carbon Design doesn't
    automatically customize all these for us). 

### To see the designs anytime
To see the designs without needing Zeplin account access:
[Desktop](https://zpl.io/agmBNlR) | [Tablet](https://zpl.io/VKev8wP) 

### To use the designs and the styleguide

First, watch this video for Devs on how to use Zeplin:
[![How to see UX & component guidance in Zeplin designs](https://img.youtube.com/vi/SjluEGDH4LU/0.jpg)](https://www.youtube.com/watch?v=SjluEGDH4LU&feature=youtu.be&ab_channel=OpenMRS "OpenMRS 3.0: Zeplin Intro for New OpenMRS Devs")

To use the designs as a developer, you'll need to request Zeplin access from an OpenMRS
admin; then, you can find them here:
[Dev Desktop](https://app.zeplin.io/project/605a0def8c1a5c07401482c1) |
[Dev Tablet](https://app.zeplin.io/project/5f7223cfda10f94d67cec6d0) 

Access the [OpenMRS Styleguide here](https://app.zeplin.io/project/5f7223cfda10f94d67cec6d0/styleguide/components).

## Why use a Style Guide or a Design System?
Users want a consistent, professional front-end UI. Without a style guide, 
the expectations for various UI elements are unclear. This can create a messy, 
inconsistent user experience. This is especially important in medical software: 
end users want confidence in a professional system, and the UI is the user's 
first encounter with that system. A poor UI can damage users' trust and can 
slow down staff workflows. 

A shared, clear Design System helps to
* assure consistency among frontend contributors in the UI look and feel for users
* use precious technical time focusing on engineering work and on the clinical use/workflows,
    rather than having to spend time on the details of how widgets should look and behave
* make it faster for developers to contribute new features that add value for end users 

A **design system** is a guide for making decisions about how interfaces should look, 
how they should be structured, and the patterns according to which user experiences 
are structured. Style Guides like Bootstrap and Material typically don’t provide this 
kind of detail. We wanted a Style Guide that would also link to code you'll use in 
your actual code base. 

You can learn more about 
[why we specifically chose Carbon Design as our Design System here](https://wiki.openmrs.org/x/uAwGDg). 
