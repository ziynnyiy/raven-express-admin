import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2";
import Spinner from "@/components/Spinner";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setIsLoading(true);
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
      setIsLoading(false);
    });
  }

  async function saveCategory(Event) {
    Event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategory("");
    setProperties([]);
    fetchCategories();
  }

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","), // 要將檔案的資料結構改成轉為 string, 這樣之後在執行 saveCategory func時使用 .split()才不會 return error
      })),
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure",
        text: `確定要刪除 ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "取消",
        confirmButtonText: "刪除",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>分類</h1>
      <label>
        {editedCategory ? `編輯分類  ${editedCategory.name}` : "創建新的分類"}
      </label>
      <form onSubmit={saveCategory} className="">
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"分類名稱"}
            onChange={(Event) => setName(Event.target.value)}
            value={name}
          />
          <select
            onChange={(Event) => {
              setParentCategory(Event.target.value);
            }}
            value={parentCategory}
          >
            <option value="">請選擇上層分類</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">屬性</label>
          <button
            onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2"
          >
            新增更多屬性
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={property.name}
                  className="mb-0"
                  onChange={(Event) => {
                    handlePropertyNameChange(
                      index,
                      property,
                      Event.target.value,
                    );
                  }}
                  placeholder="屬性名稱 (範例: 顏色、儲存容量...)"
                />
                <input
                  type="text"
                  value={property.values}
                  className="mb-0"
                  onChange={(Event) => {
                    handlePropertyValuesChange(
                      index,
                      property,
                      Event.target.value,
                    );
                  }}
                  placeholder="屬性種類 (請使用逗號隔開)"
                />
                <button
                  onClick={() => {
                    removeProperty(index);
                  }}
                  type="button" // important! => prevent the click event from being seen as a form-posting situation
                  className="bg-red-200 text-red-600 flex justify-center  w-[8rem]  py-1.5 rounded-sm whitespace-nowrap"
                >
                  移除
                </button>
              </div>
            ))}
        </div>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
              className="btn-default"
            >
              取消
            </button>
          )}
          <button type="submit" className="btn-primary">
            儲存
          </button>
        </div>
      </form>
      {/* editedCategory 不存在的話就會顯示，有點反直覺，需要思考一下 */}
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>分類名稱</td>
              <td>上層分類</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={3}>
                  <div className="py-4">
                    <Spinner fullWidth={true} />
                  </div>
                </td>
              </tr>
            )}

            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => {
                        editCategory(category);
                      }}
                      className="btn-default mr-1"
                    >
                      編輯
                    </button>
                    <button
                      onClick={() => {
                        deleteCategory(category);
                      }}
                      className="btn-red"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
