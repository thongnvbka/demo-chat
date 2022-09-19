import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

import useViewport from "../hooks/useViewport";
import useGetAllFirestore from "../hooks/useGetAllFirestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const AppContext = createContext();

// LƯU TRỮ CHUNG DỮ LIỆU CHO TOÀN BỘ APP

// Có nhiệm vụ truyền context khi lấy được data
// từ câu truy vấn đến realtime database
function AppProvider({ children }) {
  // Set trạng thái hiển thị cho modal Add Room
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);

  // Set trạng thái hiển thị cho modal Invite Members
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);

  // Phòng đang được chọn để hiển thị chat
  const [selectedRoomId, setSelectedRoomId] = useState("");

  // Set trạng thái hiển thị của Room Menu
  const [isRoomMenuVisible, setIsRoomMenuVisible] = useState(false);
  // Hàm xử lý mở modal Room Menu
  const handleRoomMenuVisible = () => {
    setIsRoomMenuVisible(!isRoomMenuVisible);
  };

  // Lấy ra uid của user hiện tại
  const { uid } = useContext(AuthContext);

  // Lấy danh sách các phòng có user hiện tại
  /**room:
   * {
   *    name: 'room name',
   *    description: 'mo ta',
   *    members: [uid1, uid2,...]
   * }
   */

  // LƯU Ý: Vì object là kiểu tham chiếu
  // Nên mỗi lần được gọi useFirestore hiểu là
  // 1 dữ liệu mới nên sẽ tạo nên vòng lặp vô hạn
  // nên cần phải cho vào useMemo
  const roomsCondition = useMemo(() => {
    // Tìm tất cả rooms có trường members chứa uid không
    return {
      fielName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);

  const rooms = useFirestore("rooms", roomsCondition);

  // Lấy ra phòng được selected
  const selectedRoom = useMemo(() => {
    return rooms.find((room) => room.id === selectedRoomId);
  }, [rooms, selectedRoomId]);

  // Kiểm tra xem đã được chọn phòng chưa
  // nếu chưa phải gán cho 1 object chứa members rỗng
  // nếu không sẽ bị lỗi undefined.members

  const selectedRoomMembers = useMemo(() => {
    let roomMembers = selectedRoom;
    if (!roomMembers) {
      roomMembers = {
        members: "",
      };
    }
    return roomMembers;
  }, [selectedRoom]);

  // Lấy TẤT CẢ user
  const users = useGetAllFirestore("users");

  const members = useMemo(() => {
    if (users.length >= 1 && selectedRoomMembers) {
      return users.filter((user) => {
        return selectedRoomMembers.members.includes(user.uid);
      });
    }
  }, [users, selectedRoomMembers]);

  // Cập nhật lại members của room để thêm biệt danh
  const allRooms = useGetAllFirestore("rooms");
  const closeRef = useRef(0);
  // console.log("All rooms: ", allRooms);
  useEffect(() => {
    if (closeRef.current === 1) return;
    console.log("run run run", {
      allRooms: allRooms.length,
      current: closeRef.current,
      users: users.length,
    });
    if (allRooms.length && closeRef.current !== 1 && users.length) {
      allRooms.forEach((room) => {
        let newArray = room.members.map((uid) => {
          let oldmember = users.find((member) => member.uid === uid);
          console.log("Room:", oldmember);
          if (oldmember) {
            return {
              uid,
              nickname: oldmember.displayName,
            };
          } else return "";
        });

        let roomsRef = doc(db, "rooms", room.id);
        updateDoc(roomsRef, {
          roomNicknames: newArray,
        });
      });
      closeRef.current = 1;
    }
  }, [allRooms, users]);

  // Xử lý responsive
  const viewport = useViewport();
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (viewport.width < 768) {
      setIsMobile(true);
      setIsDesktop(false);
    } else {
      setIsMobile(false);
      setIsDesktop(true);
    }
  }, [viewport.width]);

  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        users,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        selectedRoom,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        isMobile,
        isDesktop,
        isRoomMenuVisible,
        setIsRoomMenuVisible,
        handleRoomMenuVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppContext };
export default AppProvider;
