
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { clearTokens } from "@/lib/auth";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  LogOut,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Building2,
} from "lucide-react";

// SUPPLIER DATABASE STRUCTURE
interface Supplier {
  id: number;
  type_name: string;
  type_address: string;
}

interface SupplierForm {
  type_name: string;
  type_address: string;
}

export default function DashboardPage() {
  useAuthGuard({ requireAuth: true });

  const router = useRouter();
  const endpoint = CONFIG.ENDPOINTS.SUPPLIERS;

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] =
    useState<Supplier | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState<SupplierForm>({
    type_name: "",
    type_address: "",
  });

  // GET ALL SUPPLIERS
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiClient<Supplier[]>(endpoint, {
        method: "GET",
        requiresAuth: true,
      });

      setSuppliers(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load suppliers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // RESET FORM
  const resetForm = () => {
    setForm({
      type_name: "",
      type_address: "",
    });

    setEditingId(null);
  };

  // CREATE SUPPLIER
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.type_name.trim() || !form.type_address.trim()) {
      setError("Please enter the supplier name and address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await apiClient<Supplier>(endpoint, {
        method: "POST",
        requiresAuth: true,
        body: JSON.stringify({
          type_name: form.type_name.trim(),
          type_address: form.type_address.trim(),
        }),
      });

      setSuccess("Supplier added successfully!");
      resetForm();

      await fetchSuppliers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add supplier."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // SELECT SUPPLIER FOR EDITING
  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);

    setForm({
      type_name: supplier.type_name,
      type_address: supplier.type_address,
    });

    setError("");
    setSuccess("");
  };

  // UPDATE SUPPLIER
  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId === null) return;

    if (!form.type_name.trim() || !form.type_address.trim()) {
      setError("Please enter the supplier name and address.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await apiClient<Supplier>(
        `${endpoint}/${editingId}`,
        {
          method: "PUT",
          requiresAuth: true,
          body: JSON.stringify({
            type_name: form.type_name.trim(),
            type_address: form.type_address.trim(),
          }),
        }
      );

      setSuccess("Supplier updated successfully!");
      resetForm();

      await fetchSuppliers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update supplier."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE SUPPLIER
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await apiClient(`${endpoint}/${id}`, {
        method: "DELETE",
        requiresAuth: true,
      });

      setSuccess("Supplier deleted successfully!");

      if (selectedSupplier?.id === id) {
        setSelectedSupplier(null);
      }

      if (editingId === id) {
        resetForm();
      }

      await fetchSuppliers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete supplier."
      );
    }
  };

  // VIEW SUPPLIER
  const handleView = async (id: number) => {
    try {
      setError("");

      const data = await apiClient<Supplier>(
        `${endpoint}/${id}`,
        {
          method: "GET",
          requiresAuth: true,
        }
      );

      setSelectedSupplier(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load supplier."
      );
    }
  };

  // LOGOUT
  const handleLogout = () => {
    clearTokens();
    router.push(CONFIG.ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950">

      {/* NAVBAR */}
      <nav className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />

            <h1 className="text-xl font-bold">
              Suppliers Dashboard
            </h1>
          </div>

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>

        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">

        {/* PAGE TITLE */}
        <div>
          <h2 className="text-2xl font-bold">
            Supplier Management
          </h2>

          <p className="text-sm text-slate-500">
            Add and manage your suppliers.
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="p-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
            {success}
          </div>
        )}

        {/* ADD / UPDATE SUPPLIER FORM */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId !== null
                ? "Update Supplier"
                : "Add New Supplier"}
            </CardTitle>

            <p className="text-sm text-slate-500">
              Enter the supplier name and address.
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={editingId !== null ? handleUpdate : handleCreate}
              className="space-y-5"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* SUPPLIER NAME */}
                <div className="space-y-2">
                  <Label htmlFor="type_name">
                    Supplier Name
                  </Label>

                  <Input
                    id="type_name"
                    placeholder="Enter supplier name"
                    value={form.type_name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type_name: e.target.value,
                      })
                    }
                    required
                    maxLength={100}
                  />
                </div>

                {/* SUPPLIER ADDRESS */}
                <div className="space-y-2">
                  <Label htmlFor="type_address">
                    Supplier Address
                  </Label>

                  <Input
                    id="type_address"
                    placeholder="Enter supplier address"
                    value={form.type_address}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type_address: e.target.value,
                      })
                    }
                    required
                    maxLength={100}
                  />
                </div>

              </div>

              {/* BUTTONS */}
              <div className="flex justify-end gap-2">

                {editingId !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}

                <Button type="submit" disabled={submitting}>
                  {editingId !== null ? (
                    <>
                      <Pencil className="h-4 w-4 mr-2" />
                      {submitting ? "Updating..." : "Update Supplier"}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      {submitting ? "Adding..." : "Add Supplier"}
                    </>
                  )}
                </Button>

              </div>

            </form>
          </CardContent>
        </Card>

        {/* SUPPLIER DETAILS */}
        {selectedSupplier && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Supplier Details
              </CardTitle>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedSupplier(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedSupplier.id}
              </p>

              <p>
                <strong>Supplier Name:</strong>{" "}
                {selectedSupplier.type_name}
              </p>

              <p>
                <strong>Supplier Address:</strong>{" "}
                {selectedSupplier.type_address}
              </p>
            </CardContent>
          </Card>
        )}

        {/* SUPPLIER LIST */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">

            <div>
              <CardTitle>
                Your Suppliers ({suppliers.length})
              </CardTitle>

              <p className="text-sm text-slate-500 mt-1">
                {suppliers.length} supplier(s) recorded.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchSuppliers}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>

          </CardHeader>

          <CardContent>

            {loading ? (
              <p className="text-center py-8 text-slate-500">
                Loading suppliers...
              </p>
            ) : suppliers.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                No suppliers found. Add your first supplier above.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">

                  <thead>
                    <tr className="border-b text-left text-slate-500">
                      <th className="p-3">ID</th>
                      <th className="p-3">Supplier Name</th>
                      <th className="p-3">Supplier Address</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {suppliers.map((supplier) => (
                      <tr
                        key={supplier.id}
                        className="border-b hover:bg-slate-50 dark:hover:bg-gray-900"
                      >

                        <td className="p-3">
                          {supplier.id}
                        </td>

                        <td className="p-3 font-medium">
                          {supplier.type_name}
                        </td>

                        <td className="p-3">
                          {supplier.type_address}
                        </td>

                        <td className="p-3">
                          <div className="flex gap-2">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(supplier.id)}
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(supplier)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(supplier.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </CardContent>
        </Card>

      </main>
    </div>
  );
}
