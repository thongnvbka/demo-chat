import classNames from "classnames/bind";
import styles from "./UserInfo.module.scss";

import { useContext, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

import { AppContext } from "../../../Context/AppProvider";
import userPlacehoderImg from "../../../assets/images/user.png";
import CreateRoomModal from "../../Modals/CreateRoomModal";
import UserOption from "../../Modals/UserOption";
import Skeleton from "../../Skeleton";

const cx = classNames.bind(styles);

function UserInfo() {
  const { setIsAddRoomVisible, isMobile, currentUser } = useContext(AppContext);

  // User menu visible
  const [isVisible, setIsVisible] = useState(false);

  // Open modal when click reacte room button
  const handleAddRoom = () => {
    setIsAddRoomVisible(true);
  };

  return (
    <div className={cx("user-info", { fixed: isMobile })}>
      <div
        onClick={() => {
          setIsVisible(true);
        }}
        className={cx("container")}
      >
        {currentUser && (
          <img
            className={cx("user-img")}
            src={currentUser.photoURL || userPlacehoderImg}
            alt=""
          />
        )}
      </div>

      <h2 className={cx("title")}>Chat</h2>

      <div className={cx("new-room-wrap")}>
        <i onClick={handleAddRoom} className={cx("new-room-icon")}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </i>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal />

      <UserOption visible={isVisible} setVisible={setIsVisible} />
    </div>
  );
}

const Loading = () => {
  const { isMobile } = useContext(AppContext);

  return (
    <div className={cx("user-info", { fixed: isMobile })}>
      <div className={cx("container")}>
        <Skeleton className={cx("user-img")} />
      </div>

      <Skeleton style={{ height: 14, width: 60 }} className={cx("title")} />

      <div className={cx("new-room-wrap")}>
        <Skeleton className={cx("new-room-icon")} />
      </div>
    </div>
  );
};

UserInfo.Loading = Loading;

export default UserInfo;
