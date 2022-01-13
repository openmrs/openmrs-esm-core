import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  InlineLoading,
} from "carbon-components-react";
import {
  getBreadcrumbsFor,
  ConfigurableLink,
  BreadcrumbRegistration,
} from "@openmrs/esm-framework";

function getPath(path: string, params: Array<string>) {
  const parts = [...params];
  return path.replace(/:([A-Za-z0-9_]+)/g, (s) => parts.shift() ?? s);
}

function getParams(path: string, matcher: RegExp) {
  const match = matcher?.exec(path);

  if (match) {
    const [, ...params] = match;
    return params;
  } else {
    const segments = path.split("/");
    segments.pop();

    if (segments.length > 1) {
      const newPath = segments.join("/");
      return getParams(newPath, matcher);
    }
  }

  return [];
}

interface CustomBreadcrumbItemProps {
  breadcrumbRegistration: BreadcrumbRegistration;
  params: any;
}

export const CustomBreadcrumbItem: React.FC<CustomBreadcrumbItemProps> = ({
  breadcrumbRegistration,
  params,
}) => {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (typeof breadcrumbRegistration.settings.title === "function") {
      Promise.resolve(breadcrumbRegistration.settings.title(params)).then(
        (res) => setTitle(res)
      );
    } else {
      setTitle(breadcrumbRegistration.settings.title);
    }
  }, [breadcrumbRegistration, params]);

  return (
    <BreadcrumbItem key={breadcrumbRegistration.settings.path}>
      <ConfigurableLink
        to={getPath(breadcrumbRegistration.settings.path, params)}
      >
        {title ? title : <InlineLoading />}
      </ConfigurableLink>
    </BreadcrumbItem>
  );
};

export const Breadcrumbs: React.FC = () => {
  const [path, setPath] = useState(location.pathname);
  const breadcrumbs = getBreadcrumbsFor(path);
  const currentBc = breadcrumbs[breadcrumbs.length - 1];
  const params = getParams(path, currentBc?.matcher);

  useEffect(() => {
    const handler = () => setPath(location.pathname);
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  if (breadcrumbs.length > 4) {
    breadcrumbs.splice(1, breadcrumbs.length - 3, {
      ...breadcrumbs[1],
      settings: {
        ...breadcrumbs[1].settings,
        title: "...",
      },
    });
  }

  return (
    <Breadcrumb className="breadcrumbs-container">
      {breadcrumbs.map((bc, i) => (
        <CustomBreadcrumbItem
          breadcrumbRegistration={bc}
          params={params}
          key={`${bc.settings.title}${i}`}
        />
      ))}
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Beatae
        reprehenderit tenetur odit amet quaerat maxime saepe non, doloremque
        corporis laudantium in dolore animi cum deleniti, earum molestiae vitae
        alias impedit?
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate
        exercitationem rerum aspernatur repellat? Vitae, delectus magnam. Iusto
        consectetur quaerat sequi tempora, a vero et aliquam! Tenetur id
        doloremque ratione totam.
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Modi
        consequuntur, itaque non labore, id, nemo nam enim error molestiae
        blanditiis reiciendis corrupti ullam quis dolore dignissimos nostrum
        tempore ipsa. Laudantium?
      </p>
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Illo porro,
        eos, hic officia maiores natus maxime debitis fugit doloremque non
        exercitationem accusamus sit possimus culpa tempora blanditiis
        laudantium delectus eligendi!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe minima
        est soluta modi ipsa ab voluptatum ipsum doloremque officiis voluptate
        aliquid tempore in, labore quia aperiam quod sequi iusto minus.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cum nesciunt
        culpa, provident voluptatum delectus molestias esse commodi temporibus
        expedita blanditiis earum odit, incidunt in? Modi illo veniam ad quasi
        magni?
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
        beatae omnis voluptas eaque aperiam explicabo nulla dolorem, asperiores
        magnam! Nesciunt minima alias enim, consequuntur eos nemo molestias
        cumque qui voluptas!
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
        cupiditate, ipsam aspernatur voluptatibus repellat reiciendis esse
        quidem assumenda, non consectetur beatae autem ea temporibus dignissimos
        porro optio. Delectus, corporis placeat!
      </p>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eaque eius
        maiores, pariatur quis recusandae nemo velit architecto veniam dicta
        eum, aperiam ipsam. Ducimus deleniti architecto velit totam, quidem
        dicta natus.
      </p>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
