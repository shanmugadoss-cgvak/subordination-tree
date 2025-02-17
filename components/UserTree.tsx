import React from "react";

interface User {
  id: number;
  name: string;
  parentId: number | null;
}

interface UserTreeProps {
  users: User[];
  parentId: number | null;
}

const UserTree: React.FC<UserTreeProps> = ({ users, parentId }) => {
  const children = users.filter(user => user.parentId === parentId);

  if (children.length === 0) {
    return null;
  }

  return (
    <ul className="menu bg-base-200 rounded-box w-56">
      {children.map(child => (
        <li key={child.id}>
          <a>{child.name}</a>
          <UserTree users={users} parentId={child.id} />
        </li>
      ))}
    </ul>
  );
};

export default UserTree;