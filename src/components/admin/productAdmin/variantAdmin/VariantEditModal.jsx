import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import VariantImageUploader from "./VariantImageUploader";
import { updateVariant } from "@/apis/variant";
import { getDistinctAttributeNames, getDistinctAttributeValuesByName } from "@/apis/attribute"; // Import new API functions

const VariantEditModal = ({
  isOpen,
  onClose,
  variant,
  productId,
  token,
  reloadProduct,
}) => {
  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  const [form, setForm] = useState({
    sku: variant?.sku || "",
    price: variant?.price || 0,
    stockQuantity: variant?.stockQuantity || 0,
    imageFile: null,
    attributes: variant?.attributes || variant?.variantAttributes || [],
  });

  // States for dynamic attributes
  const [attributeNames, setAttributeNames] = useState([]);
  const [attributeValues, setAttributeValues] = useState([]);
  const [loadingAttributes, setLoadingAttributes] = useState(false);
  const [loadingValues, setLoadingValues] = useState(false);

  // Normalize attributes - ensure all have 'name' field
  const normalizeAttributes = (attrs) => {
    if (!attrs) return [];
    return attrs.map((attr) => {
      // Ensure attribute has 'name' field (convert from old 'type' format if needed)
      const attributeName = attr.name || (attr.type ? attr.type.toUpperCase() : "");
      return {
        ...attr,
        name: attributeName,
      };
    });
  };

  const normalizedAttributes = normalizeAttributes(form.attributes);
  const [editingAttribute, setEditingAttribute] = useState(null);
  const [attributeId, setAttributeId] = useState(null);

  // Fetch distinct attribute names using new API
  const fetchAttributeNames = async (searchTerm = "") => {
    setLoadingAttributes(true);
    try {
      const response = await getDistinctAttributeNames(searchTerm);
      if (response.status === "SUCCESS") {
        setAttributeNames(response.data || []);
      } else {
        toast.error("Lỗi khi tải danh sách thuộc tính");
      }
    } catch (err) {
      toast.error(`Lỗi: ${err.message}`);
      console.error(err);
    } finally {
      setLoadingAttributes(false);
    }
  };

  // Fetch distinct attribute values by name using new API
  const fetchAttributeValues = async (attrName) => {
    if (!attrName) {
      setAttributeValues([]);
      return;
    }
    setLoadingValues(true);
    try {
      const response = await getDistinctAttributeValuesByName(attrName);
      if (response.status === "SUCCESS") {
        setAttributeValues(response.data || []);
      } else {
        toast.error("Lỗi khi tải giá trị thuộc tính");
      }
    } catch (err) {
      toast.error(`Lỗi: ${err.message}`);
      console.error(err);
    } finally {
      setLoadingValues(false);
    }
  };

  // Debounce function for name input search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name) {
        fetchAttributeNames(name); // Search as user types
      } else {
        fetchAttributeNames(); // Fetch all if empty
      }
    }, 800); // Tăng debounce lên 800ms để chỉ recommend khi ngừng nhập lâu hơn

    return () => clearTimeout(timer);
  }, [name]);

  // Debounce for fetching values when name changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (name) {
        fetchAttributeValues(name);
      } else {
        setAttributeValues([]);
      }
    }, 800); // Tăng debounce lên 800ms cho values

    return () => clearTimeout(timer);
  }, [name]);

  // Fetch names on modal open
  useEffect(() => {
    if (isOpen) {
      fetchAttributeNames();
    }
  }, [isOpen]);

  // When editing, set name and fetch values
  useEffect(() => {
    if (editingAttribute) {
      setName(editingAttribute.name || "");
      setValue(editingAttribute.value || "");
      // Fetch values for the editing name
      if (editingAttribute.name) {
        fetchAttributeValues(editingAttribute.name);
      }
    }
  }, [editingAttribute]);

  if (!isOpen || !variant) return null;

  // Build FormData for API call
  const buildFormData = (formState) => {
    const formData = new FormData();
    
    // Add required fields
    if (formState.sku) {
      formData.append("sku", formState.sku);
    }
    formData.append("productId", productId);
    formData.append("price", formState.price);
    formData.append("stockQuantity", formState.stockQuantity);
    
    // Add image if exists
    if (formState.imageFile) {
      formData.append("image", formState.imageFile);
    }
    
    // Add attributes as array of objects with name and value
    // Ensure attributes is always an array
    const attributesArray = Array.isArray(formState.attributes) ? formState.attributes : [];
    const normalizedAttrs = normalizeAttributes(attributesArray);
    
    // Filter and format attributes
    const attributesForAPI = normalizedAttrs
      .filter((attr) => attr.name && attr.value) // Filter out empty attributes
      .map((attr) => ({
        name: attr.name || "",
        value: attr.value || "",
      }));
    
    // Append attributes as JSON string (backend expects JSON string in FormData)
    // Format: [{"name":"COLOR","value":"Red"},{"name":"SIZE","value":"L"}]
    formData.append("attributes", JSON.stringify(attributesForAPI));
    
    return formData;
  };

  // Call updateVariant API
  const callUpdateVariant = async (formState) => {
    try {
      const formData = buildFormData(formState);
      const response = await updateVariant(variant.id, formData);
      
      if (response.status === "SUCCESS") {
        toast.success("Cập nhật variant thành công");
        reloadProduct();
        return true;
      }
      return false;
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      console.log(err);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    setForm((prev) => ({ ...prev, [name]: inputValue }));
  };

  const handleDeleteAttribute = async (attributeToDelete) => {
    // Save current state for potential revert
    const previousAttributes = [...form.attributes];
    
    try {
      // Update local state first
      // Match by id if both have id, otherwise match by name+value
      const updatedAttributes = form.attributes.filter((attr) => {
        if (attributeToDelete.id && attr.id) {
          return attr.id !== attributeToDelete.id;
        }
        // If no id, match by name and value
        const attrName = attr.name || "";
        const attrToDeleteName = attributeToDelete.name || "";
        return !(attrName === attrToDeleteName && attr.value === attributeToDelete.value);
      });
      
      const updatedForm = {
        ...form,
        attributes: updatedAttributes,
      };
      
      setForm(updatedForm);
      
      // Call API to update variant
      const success = await callUpdateVariant(updatedForm);
      if (!success) {
        // Revert state on failure
        setForm((prev) => ({
          ...prev,
          attributes: previousAttributes,
        }));
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      // Revert state on error
      setForm((prev) => ({
        ...prev,
        attributes: previousAttributes,
      }));
    }
  };

  const handleAddAttribute = async () => {
    if (!name || !value) return;
    
    // Ensure attributes is always an array
    const currentAttributes = Array.isArray(form.attributes) ? form.attributes : [];
    
    // Save current state for potential revert
    const previousAttributes = [...currentAttributes];
    const previousName = name;
    const previousValue = value;
    
    try {
      // Create new attribute object with name and value
      const newAttribute = {
        name: name,
        value: value,
      };
      
      // Update local state first
      const updatedAttributes = [...currentAttributes, newAttribute];
      const updatedForm = {
        ...form,
        attributes: updatedAttributes,
      };
      
      setForm(updatedForm);
      setName("");
      setValue("");
      
      // Call API to update variant
      const success = await callUpdateVariant(updatedForm);
      if (!success) {
        // Revert state on failure
        setForm((prev) => ({
          ...prev,
          attributes: previousAttributes,
        }));
        setName(previousName);
        setValue(previousValue);
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      // Revert state on error
      setForm((prev) => ({
        ...prev,
        attributes: previousAttributes,
      }));
      setName(previousName);
      setValue(previousValue);
    }
  };

  const handleUpdateAttribute = async () => {
    if (!editingAttribute) return;
    
    // Save current state for potential revert
    const previousAttributes = [...form.attributes];
    const previousEditingAttribute = editingAttribute;
    const previousName = name;
    const previousValue = value;
    
    try {
      // Update local state first
      // Match by id if both have id, otherwise match by name+value
      const updatedAttributes = form.attributes.map((attr) => {
        let isMatch = false;
        if (editingAttribute.id && attr.id) {
          isMatch = attr.id === editingAttribute.id;
        } else {
          // If no id, match by name and value
          const attrName = attr.name || "";
          const editingAttrName = editingAttribute.name || "";
          isMatch = attrName === editingAttrName && attr.value === editingAttribute.value;
        }
        
        if (isMatch) {
          return {
            ...attr,
            name: name,
            value: value,
          };
        }
        return attr;
      });
      
      const updatedForm = {
        ...form,
        attributes: updatedAttributes,
      };
      
      setForm(updatedForm);
      setEditingAttribute(null);
      setName("");
      setValue("");
      
      // Call API to update variant
      const success = await callUpdateVariant(updatedForm);
      if (!success) {
        // Revert state on failure
        setForm((prev) => ({
          ...prev,
          attributes: previousAttributes,
        }));
        setEditingAttribute(previousEditingAttribute);
        setName(previousName);
        setValue(previousValue);
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      // Revert state on error
      setForm((prev) => ({
        ...prev,
        attributes: previousAttributes,
      }));
      setEditingAttribute(previousEditingAttribute);
      setName(previousName);
      setValue(previousValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const success = await callUpdateVariant(form);
      if (success) {
        onClose();
      }
    } catch (err) {
      toast.error(
        `Lỗi: ${err.message} - Nguyên nhân: ${err.response?.statusText || "Unknown"}`
      );
      console.log(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#0000009e] bg-opacity-50 flex items-center justify-center p-4 overflow-auto z-10"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chỉnh sửa thuộc tính</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5 cursor-pointer" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="Nhập SKU (tùy chọn)"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Giá</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min={0}
              step="0.01"
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Tồn kho</label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              min={0}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Ảnh thuộc tính
            </label>
            <VariantImageUploader
              imageUrl={variant.image}
              onChange={(file) =>
                setForm((prev) => ({
                  ...prev,
                  imageFile: file,
                }))
              }
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Thuộc tính</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="font-semibold mb-1">Danh sách thuộc tính hiện tại</div>
                {normalizedAttributes.map((attr, idx) => (
                  <div
                    key={attr.id || idx}
                    className="flex items-center gap-2 mb-1"
                  >
                    <span
                      className="rounded-bl-xs cursor-pointer bg-gray-400 w-auto p-1 m-1 text-white hover:text-indigo-500 hover:bg-white duration-200 hover:border"
                      onClick={() => {
                        setEditingAttribute(attr);
                        setAttributeId(attr.id);
                      }}
                    >
                      {attr.name}: {attr.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteAttribute(attr)}
                      className="text-red-500 cursor-pointer hover:text-red-800 duration-200"
                      title="Xóa thuộc tính"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValue(""); // Reset value when name changes
                }}
                list={loadingAttributes ? undefined : "name-list"} // Không show datalist khi đang loading
                placeholder="Chọn hoặc nhập loại thuộc tính mới"
                disabled={loadingAttributes}
                className="border focus:outline-none focus:ring-0 focus:border-red-700 border-orange-600 rounded px-2 py-1 flex-1"
              />
              <datalist id="name-list">
                {attributeNames.map((attrName) => (
                  <option key={attrName} value={attrName} />
                ))}
              </datalist>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                list={loadingValues ? undefined : "value-list"} // Không show datalist khi đang loading
                placeholder="Chọn hoặc nhập giá trị"
                disabled={loadingValues || !name}
                className="border focus:outline-none focus:ring-0 focus:border-red-700 border-orange-600 rounded px-2 py-1 flex-1"
              />
              <datalist id="value-list">
                {attributeValues.map((attrValue) => (
                  <option key={attrValue} value={attrValue} />
                ))}
              </datalist>
            </div>
            {loadingAttributes && <p className="text-sm text-gray-500">Đang tải danh sách thuộc tính...</p>}
            {loadingValues && <p className="text-sm text-gray-500">Đang tải gợi ý giá trị...</p>}
            <button
              disabled={!name || !value || loadingAttributes || loadingValues}
              type="button"
              onClick={
                editingAttribute ? handleUpdateAttribute : handleAddAttribute
              }
              className="mt-2 px-2 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600 duration-200 disabled:opacity-50"
            >
              {editingAttribute ? "Cập nhật thuộc tính" : "Thêm thuộc tính"}
            </button>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg cursor-pointer hover:bg-orange-600 duration-200"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VariantEditModal;