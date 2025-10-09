import React from 'react'

const CollegeStudentTable = () => {
  const users = [
    { id: 1, name: 'Alice', age: 24, email: 'alice@example.com' },
    { id: 2, name: 'Bob', age: 30, email: 'bob@example.com' },
    { id: 3, name: 'Charlie', age: 28, email: 'charlie@example.com' },
  ];
  return (
    <div>
        <div className=" p-6 bg-base-100  w-full max-w-8xl">
      <h2 className="text-2xl font-semibold mb-4">User Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left border-b">ID</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Age</th>
              <th className="px-4 py-2 text-left border-b">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.id}</td>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.age}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  )
}

export default CollegeStudentTable