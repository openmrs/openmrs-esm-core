import React from "react";
import UserAvatarFilledAlt20 from "@carbon/icons-react/es/user--avatar--filled--alt/20";
import styles from "./user-panel-switcher.component.scss";
import { Switcher } from "carbon-components-react";
import { LoggedInUser } from "@openmrs/esm-framework";

export interface UserPanelSwitcherItemProps {
  user: LoggedInUser;
}

const UserPanelSwitcher: React.FC<UserPanelSwitcherItemProps> = ({ user }) => (
  <div className={styles.switcherContainer}>
    <Switcher aria-label="Switcher Container">
      <UserAvatarFilledAlt20 />
      <p>{user.person.display}</p>
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
    </Switcher>
  </div>
);

export default UserPanelSwitcher;
