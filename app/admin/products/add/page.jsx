"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCategories } from "@/lib/store/slices/categoriesSlice";
import { fetchBrands } from "@/lib/store/slices/brandsSlice";
import { typesApi } from "@/lib/api";
import { productsApi } from "@/lib/api";
import Footer from "@/components/layout/Footer";
import styles from "./page.module.css";

export default function AddProductPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { items: categories } = useAppSelector((state) => state.categories);
  const { items: brands } = useAppSelector((state) => state.brands);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category_id: "",
    type_id: "",
    brand_id: "",
    delivery: "China",
    sizes: [],
    size_type: "",
  });
  
  const [types, setTypes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [sizeChart, setSizeChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Проверить авторизацию
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/token');
        const data = await response.json();
        setIsAuthenticated(!!data.token);
      } catch (err) {
        console.error('Failed to check auth:', err);
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, []);

  // Загрузить категории и бренды
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchBrands());
  }, [dispatch]);

  // Загрузить типы при выборе категории
  useEffect(() => {
    if (formData.category_id) {
      loadTypes(formData.category_id);
    } else {
      setTypes([]);
      setFormData(prev => ({ ...prev, type_id: "" }));
    }
  }, [formData.category_id]);

  const loadTypes = async (categoryId) => {
    try {
      setLoadingTypes(true);
      const data = await typesApi.getByCategory(categoryId);
      setTypes(data);
    } catch (err) {
      console.error("Failed to load types:", err);
      setError("Не удалось загрузить типы");
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizesChange = (e) => {
    const sizes = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      sizes,
    }));
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
  };

  const handleSizeChartChange = (e) => {
    setSizeChart(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Проверка авторизации
      if (!isAuthenticated) {
        throw new Error("Вы не авторизованы. Пожалуйста, войдите через Telegram для создания товаров.");
      }

      // Валидация
      if (!formData.name || !formData.price || !formData.category_id || 
          !formData.type_id || !formData.brand_id) {
        throw new Error("Заполните все обязательные поля");
      }

      if (photos.length === 0) {
        throw new Error("Добавьте хотя бы одно фото");
      }

      // Подготовка данных
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        type_id: parseInt(formData.type_id),
        brand_id: parseInt(formData.brand_id),
        delivery: formData.delivery,
        photos: photos,
        sizes: formData.sizes,
      };

      if (formData.size_type) {
        productData.size_type = formData.size_type;
      }

      if (sizeChart) {
        productData.size_chart = sizeChart;
      }

      // Отправка через API
      const result = await productsApi.create(productData);
      
      setSuccess(true);
      setFormData({
        name: "",
        price: "",
        category_id: "",
        type_id: "",
        brand_id: "",
        delivery: "China",
        sizes: [],
        size_type: "",
      });
      setPhotos([]);
      setSizeChart(null);

      // Перенаправление на страницу товара через 2 секунды
      setTimeout(() => {
        router.push(`/product/${result.id}`);
      }, 2000);

    } catch (err) {
      console.error("Failed to create product:", err);
      setError(err.message || "Не удалось создать товар");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Добавить товар</h1>

        {success && (
          <div className={styles.success}>
            ✅ Товар успешно создан! Перенаправление на страницу товара...
          </div>
        )}

        {error && (
          <div className={styles.error}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Название */}
          <div className={styles.field}>
            <label className={styles.label}>
              Название товара <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Например: Кофта Supreme"
              required
            />
          </div>

          {/* Цена */}
          <div className={styles.field}>
            <label className={styles.label}>
              Цена (₽) <span className={styles.required}>*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="127899"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Категория */}
          <div className={styles.field}>
            <label className={styles.label}>
              Категория <span className={styles.required}>*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Выберите категорию</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Тип */}
          <div className={styles.field}>
            <label className={styles.label}>
              Тип <span className={styles.required}>*</span>
            </label>
            <select
              name="type_id"
              value={formData.type_id}
              onChange={handleInputChange}
              className={styles.select}
              disabled={!formData.category_id || loadingTypes}
              required
            >
              <option value="">
                {loadingTypes ? "Загрузка..." : "Выберите тип"}
              </option>
              {types.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Бренд */}
          <div className={styles.field}>
            <label className={styles.label}>
              Бренд <span className={styles.required}>*</span>
            </label>
            <select
              name="brand_id"
              value={formData.brand_id}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="">Выберите бренд</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Доставка */}
          <div className={styles.field}>
            <label className={styles.label}>
              Доставка <span className={styles.required}>*</span>
            </label>
            <select
              name="delivery"
              value={formData.delivery}
              onChange={handleInputChange}
              className={styles.select}
              required
            >
              <option value="China">China</option>
              <option value="Orenburg">Orenburg</option>
              <option value="Moscow">Moscow</option>
            </select>
          </div>

          {/* Размеры */}
          <div className={styles.field}>
            <label className={styles.label}>
              Размеры (через запятую)
            </label>
            <input
              type="text"
              value={formData.sizes.join(", ")}
              onChange={handleSizesChange}
              className={styles.input}
              placeholder="XS, S, M, L, XL"
            />
            <small className={styles.hint}>
              Введите размеры через запятую, например: XS, S, M, L, XL
            </small>
          </div>

          {/* Тип размера */}
          <div className={styles.field}>
            <label className={styles.label}>
              Тип размера
            </label>
            <input
              type="text"
              name="size_type"
              value={formData.size_type}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="Например: EU, US, UK"
            />
          </div>

          {/* Фото */}
          <div className={styles.field}>
            <label className={styles.label}>
              Фото товара <span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoChange}
              className={styles.fileInput}
              required
            />
            {photos.length > 0 && (
              <div className={styles.photosPreview}>
                <p>Выбрано фото: {photos.length}</p>
                <div className={styles.photosList}>
                  {photos.map((photo, index) => (
                    <div key={index} className={styles.photoItem}>
                      {photo.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <small className={styles.hint}>
              Можно выбрать несколько фото
            </small>
          </div>

          {/* Размерная сетка */}
          <div className={styles.field}>
            <label className={styles.label}>
              Размерная сетка (опционально)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSizeChartChange}
              className={styles.fileInput}
            />
            {sizeChart && (
              <div className={styles.filePreview}>
                Выбран файл: {sizeChart.name}
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать товар"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={loading}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

