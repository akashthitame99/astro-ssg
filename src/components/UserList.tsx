import { useEffect, useState } from "react";
import type { User } from "../models/UserModel";
import avatarIcon from "../assests/avatar.svg";
import axios from "axios";

interface Props {
  client: string;
}

const UserList = ({ client }: Props) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      axios
        .get("http://localhost:8083/api/users")
        .then(function (response) {
          setUsers(response.data);
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fetchUsers();
  }, []);

  const handleClick = () => {
    console.log("client", client);
  };

  return (
    <div className="flex flex-col justify-center items-center mb-4 ">
      <h5>Island Directive: {client} </h5>
      {users?.map((user: User) => (
        <div key={user.id} className="flex justify-center mb-3">
          <img src={avatarIcon.src} alt="Avatar" className="h-12 w-12" />
          <div className="flex flex-col items-start mt-2">
            <span>{user?.name}</span>
            <span className="text-sm">{user.email}</span>
            <span>{user?.address}</span>
          </div>
        </div>
      ))}
      <button
        onClick={handleClick}
        className="text-white bg-slate-900  border border-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {client}
      </button>
    </div>
  );
};

export default UserList;
