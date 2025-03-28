"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import supabase from "@/lib/supabase";
import {
  Search,
  Filter,
  ChevronDown,
  Edit,
  Trash,
  Plus,
  Loader2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { API_URL } from "@/constants/URI";
import axiosInstance from "@/lib/axios";

// User type definition
type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  balance: number;
  overdue?: number;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Fetching users from admin API");
        
        // Fetch users from the admin API endpoint
        const response = await axiosInstance.get('/admin/users');

        if (response.status !== 200) {
          throw new Error(`Error fetching users: ${response.statusText}`);
        }

        const data = response.data;
        // Check the structure of the response data
        console.log("API Response:", data);

        // Update to handle different response structures
        if (data.data && Array.isArray(data.data)) {
          setUsers(
            data.data.map((user: any) => ({
              _id: user._id,
              name: user.fullName || user.username || "Unknown",
              email: user.email || "No email",
              phone: user.phone || "N/A", // User model doesn't have phone field
              type: user.isAdmin ? "Admin" : "User",
              balance: user.balance || 0, // Default balance
              avatar: user.avatar,
            }))
          );
        } else if (Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.error("Unexpected API response structure:", data);
          setError("Received unexpected data format from server");
          // Fall back to mock data in development
          if (process.env.NODE_ENV === "development") {
            setUsers([
              {
                _id: "1",
                name: "Sisyphus Corporation",
                email: "bill.sanders@example.com",
                phone: "(626) 555-0120",
                type: "Software Agency",
                balance: 12500,
              },
              {
                _id: "2",
                name: "Luminous",
                email: "tim.jennings@example.com",
                phone: "(480) 555-0103",
                type: "Software Agency",
                balance: 0,
              },
              {
                _id: "3",
                name: "Interlock",
                email: "kemal.lawson@example.com",
                phone: "(703) 555-0127",
                type: "Advertising Agency",
                balance: 0,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");

        // For development: Use mock data if API fails
        if (process.env.NODE_ENV === "development") {
          setUsers([
            {
              _id: "1",
              name: "Sisyphus Corporation",
              email: "bill.sanders@example.com",
              phone: "(626) 555-0120",
              type: "Software Agency",
              balance: 12500,
            },
            {
              _id: "2",
              name: "Luminous",
              email: "tim.jennings@example.com",
              phone: "(480) 555-0103",
              type: "Software Agency",
              balance: 0,
            },
            {
              _id: "3",
              name: "Interlock",
              email: "kemal.lawson@example.com",
              phone: "(703) 555-0127",
              type: "Advertising Agency",
              balance: 0,
            },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-4 sm:p-6">
      {/* User Management Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-2xl font-semibold">Users</h2>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" /> Add New User
          </Button>
        </div>

        {/* Error message */}
        {error && (
          <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 w-full">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading users...</span>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="border rounded-md overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="h-4 w-4" />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Coins</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-muted-foreground"
                      >
                        {searchQuery
                          ? "No users match your search criteria"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <input type="checkbox" className="h-4 w-4" />
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.type}</TableCell>
                        <TableCell>{user.balance}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
              <div className="text-sm text-muted-foreground">
                Showing{" "}
                {filteredUsers.length > 0
                  ? `1-${filteredUsers.length}`
                  : "0"}{" "}
                of {filteredUsers.length} users
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filteredUsers.length === 0}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
