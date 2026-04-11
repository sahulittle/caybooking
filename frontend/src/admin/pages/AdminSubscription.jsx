import React, { useEffect, useState } from "react";
import { subscriptionAPI } from "../../api/apiClient";
import { Check, Star, Crown, Zap, Trash2, Edit } from "lucide-react";

const AdminSubscription = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    duration: "",
    description: "",
    features: [],
    popular: false,
    isGold: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await subscriptionAPI.getAll();
      setPlans(res.data.plans || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      price: 0,
      duration: "",
      description: "",
      features: "",
      popular: false,
      isGold: false,
    });
    setShowModal(true);
  };

  const openEdit = (plan) => {
    setEditing(plan._id);
    setForm({
      name: plan.name || "",
      price: plan.price || 0,
      duration: plan.duration || "",
      description: plan.description || "",
      features: plan.features || [],
      popular: plan.popular || false,
      isGold: plan.isGold || false,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        price: Number(form.price || 0),
        duration: form.duration,
        description: form.description,
        features: JSON.stringify(
          (form.features || []).map((s) => String(s).trim()).filter(Boolean),
        ),
        popular: !!form.popular,
        isGold: !!form.isGold,
      };

      if (editing) {
        await subscriptionAPI.update(editing, payload);
      } else {
        await subscriptionAPI.create(payload);
      }
      setShowModal(false);
      load();
    } catch (err) {
      console.error("Save plan failed", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this plan?")) return;
    try {
      await subscriptionAPI.delete(id);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold">Subscription Plans</h2>
        <div>
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
          >
            Create Plan
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className={`rounded-3xl p-6 shadow-lg relative ${p.isGold ? "bg-gradient-to-b from-amber-50 to-white" : "bg-white"}`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              {p.isGold && (
                <div className="absolute -top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Best Value
                </div>
              )}

              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${p.isGold ? "bg-amber-400 text-white" : p.popular ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                  >
                    {p.isGold ? (
                      <Crown className="w-6 h-6" />
                    ) : p.popular ? (
                      <Star className="w-6 h-6" />
                    ) : (
                      <Zap className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.description}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${p.price}
                  </span>
                  {p.duration && (
                    <span className="text-gray-500">/{p.duration}</span>
                  )}
                </div>
                {!p.price && (
                  <div className="text-sm text-gray-500">
                    No credit card required
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {(p.features || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-600">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-gray-600 text-sm font-medium leading-tight">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(p)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
                >
                  {" "}
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  {" "}
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">
                {editing ? "Edit Plan" : "Create Plan"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="border p-3 rounded"
                />
                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price"
                  className="border p-3 rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="Duration (e.g. 1 Month)"
                  className="border p-3 rounded"
                />
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(e) =>
                        setForm({ ...form, popular: e.target.checked })
                      }
                    />{" "}
                    Most Popular
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.isGold}
                      onChange={(e) =>
                        setForm({ ...form, isGold: e.target.checked })
                      }
                    />{" "}
                    Best Value
                  </label>
                </div>
              </div>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Short description"
                className="border p-3 rounded w-full"
              />

              {/* Features - editable list */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Features</label>
                {(form.features || []).map((f, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={f}
                      onChange={(e) => {
                        const next = [...form.features];
                        next[idx] = e.target.value;
                        setForm({ ...form, features: next });
                      }}
                      placeholder={`Feature ${idx + 1}`}
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = form.features.filter((_, i) => i !== idx);
                        setForm({ ...form, features: next });
                      }}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        features: [...(form.features || []), ""],
                      })
                    }
                    className="px-3 py-2 bg-gray-100 rounded"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded"
                >
                  {editing ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscription;
