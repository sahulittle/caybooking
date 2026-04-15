import React, { useEffect, useState } from "react";
import { subscriptionAPI } from "../../api/apiClient";
import { Check, Star, Crown, Zap, Trash2, Edit, X } from "lucide-react";

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
      features: [],
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
      features: Array.isArray(plan.features) ? plan.features : [],
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
          (form.features || []).map((s) => String(s).trim()).filter(Boolean)
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
    <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Subscription Plans
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, and manage your pricing plans.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm font-semibold transition-colors"
        >
          Create Plan
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center text-gray-500 shadow-sm">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((p) => (
            <div
              key={p._id}
              className={`rounded-3xl p-4 sm:p-6 shadow-lg relative border border-gray-100 ${
                p.isGold ? "bg-gradient-to-b from-amber-50 to-white" : "bg-white"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {p.isGold && (
                <div className="absolute -top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                  <Crown className="w-4 h-4" />
                  Best Value
                </div>
              )}

              <div className="mb-5 sm:mb-6">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      p.isGold
                        ? "bg-amber-400 text-white"
                        : p.popular
                        ? "bg-blue-600 text-white"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {p.isGold ? (
                      <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : p.popular ? (
                      <Star className="w-5 h-5 sm:w-6 sm:h-6" />
                    ) : (
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-5 sm:mb-6 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-end gap-2 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    ${p.price}
                  </span>
                  {p.duration && (
                    <span className="text-gray-500 text-sm sm:text-base">
                      /{p.duration}
                    </span>
                  )}
                </div>

                {!p.price && (
                  <div className="text-sm text-gray-500 mt-1">
                    No credit card required
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {(p.features || []).map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-0.5 rounded-full bg-green-100 text-green-600 shrink-0">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className="text-gray-600 text-sm font-medium leading-relaxed">
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => openEdit(p)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 p-4 sm:p-6 flex items-end sm:items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
            <div className="p-4 sm:p-6 border-b flex items-center justify-between gap-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                {editing ? "Edit Plan" : "Create Plan"}
              </h3>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-80px)]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Name"
                  className="border border-gray-200 p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-100"
                />

                <input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="Price"
                  className="border border-gray-200 p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: e.target.value })
                  }
                  placeholder="Duration (e.g. 1 Month)"
                  className="border border-gray-200 p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-100"
                />

                <div className="flex flex-col sm:justify-center gap-3 rounded-xl border border-gray-200 p-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.popular}
                      onChange={(e) =>
                        setForm({ ...form, popular: e.target.checked })
                      }
                    />
                    Most Popular
                  </label>

                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.isGold}
                      onChange={(e) =>
                        setForm({ ...form, isGold: e.target.checked })
                      }
                    />
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
                className="border border-gray-200 p-3 rounded-xl w-full outline-none focus:ring-2 focus:ring-blue-100"
              />

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-800">
                  Features
                </label>

                {(form.features || []).map((f, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2">
                    <input
                      value={f}
                      onChange={(e) => {
                        const next = [...form.features];
                        next[idx] = e.target.value;
                        setForm({ ...form, features: next });
                      }}
                      placeholder={`Feature ${idx + 1}`}
                      className="border border-gray-200 p-3 rounded-xl flex-1 outline-none focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const next = form.features.filter((_, i) => i !== idx);
                        setForm({ ...form, features: next });
                      }}
                      className="px-4 py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-colors"
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
                    className="px-4 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
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