import { user, users } from "../store/user";
import { useStore } from "@nanostores/react";
import { nanoid } from "nanoid";

const UserForm = () => {
  const userData = useStore(user);
  const usersData = useStore(users);
  const jsonUsers = usersData.length > 0 ? JSON.parse(usersData) : [];

  const createOrUpdateUser = () => {
    if (JSON.parse(userData)._id !== "") {
      users.set(
        JSON.stringify(
          jsonUsers.map((u) => {
            if (u._id === JSON.parse(userData)._id) {
              return JSON.parse(userData);
            } else {
              return u;
            }
          })
        )
      );
    } else {
      const test = [
        ...jsonUsers,
        {
          ...JSON.parse(userData),
          _id: nanoid(8),
        },
      ];

      users.set(JSON.stringify(test));
    }
  };

  const setUser = (e: any) => {
    const data = {
      ...JSON.parse(userData),
      [e.target.name]: e.target.value,
    };
    user.set(JSON.stringify(data));
  };

  return (
    <>
      <div className="flex justify-center">
        <h1 className="text-5xl my-12 text-white">User Form</h1>
      </div>
      <div className="flex justify-center">
        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Name
              </label>
              <input
                name="name"
                onChange={setUser}
                // value={userData.name}/
                className="appearance-none block w-full bg-gray-200 text-gray-700 border  rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                id="grid-first-name"
                type="text"
                placeholder="Jane"
              />
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-last-name"
              >
                Email
              </label>
              <input
                name="email"
                onChange={setUser}
                // value={userData.email}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-last-name"
                type="email"
                placeholder="Doe@gmail.com"
              />
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-password"
              >
                Password
              </label>
              <input
                name="password"
                onChange={setUser}
                // value={userData.password}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="grid-password"
                type="password"
                placeholder="******************"
              />
              <p className="text-gray-600 text-xs italic">
                Make it as long and as crazy as you'd like
              </p>
            </div>
          </div>
          <button
            onClick={() => createOrUpdateUser()}
            type="button"
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
          >
            Button
          </button>
        </form>
      </div>
    </>
  );
};

export default UserForm;
