"use client";

import React, { useState, useEffect } from "react";
import { getUsers, saveUsers, User } from "@/lib/db";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleRoleChange = (id: number, newRole: User["role"]) => {
    const updated = users.map((u) => (u.id === id ? { ...u, role: newRole } : u));
    setUsers(updated);
    saveUsers(updated);
    alert(`User role successfully changed to ${newRole}!`);
  };

  const handleToggleStatus = (id: number, currentStatus: User["status"]) => {
    const nextStatus: User["status"] = currentStatus === "Active" ? "Suspended" : "Active";
    const updated = users.map((u) => (u.id === id ? { ...u, status: nextStatus } : u));
    setUsers(updated);
    saveUsers(updated);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Users & Customers</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage customer records, moderator staff, and administrator settings.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-800 dark:text-slate-205 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          <div className="absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider select-none">Role:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">All Roles</option>
            <option value="Admin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Admin</option>
            <option value="Moderator" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Moderator</option>
            <option value="Customer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Customer</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4.5 px-6 font-semibold">User</th>
                <th className="py-4.5 px-6 font-semibold">Email</th>
                <th className="py-4.5 px-6 font-semibold">Registered</th>
                <th className="py-4.5 px-6 font-semibold text-center">Status</th>
                <th className="py-4.5 px-6 font-semibold">Role</th>
                <th className="py-4.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-150 dark:border-violet-850 text-violet-600 dark:text-violet-400 font-bold text-xs select-none">
                          {getInitials(user.name)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-white leading-tight">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-550 dark:text-slate-400">{user.email}</td>
                    <td className="py-4 px-6 font-medium text-slate-400 dark:text-slate-500">{user.registeredDate}</td>
                    {/* Status Badge */}
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold border ${
                        user.status === "Active" 
                          ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30" 
                          : "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-454 border-rose-200 dark:border-rose-900/30"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    {/* Role Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as User["role"])}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-1 px-2.5 text-[11px] font-bold text-slate-750 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all cursor-pointer"
                      >
                        <option value="Admin" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Admin</option>
                        <option value="Moderator" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Moderator</option>
                        <option value="Customer" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-250">Customer</option>
                      </select>
                    </td>
                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`text-xs font-bold transition-colors cursor-pointer ${
                          user.status === "Active" 
                            ? "text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-350" 
                            : "text-emerald-600 hover:text-emerald-700 dark:text-emerald-405 dark:hover:text-emerald-350"
                        }`}
                      >
                        {user.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    No users found matching parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
