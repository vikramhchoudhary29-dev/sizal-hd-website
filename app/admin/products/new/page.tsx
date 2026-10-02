import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-8 text-4xl font-black">Add Product</h1>

      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}