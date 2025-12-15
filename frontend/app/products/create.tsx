// frontend/app/products/create.tsx
"use client";
import { useState } from "react";
import axios from "axios";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const submit = async () => {
    await axios.post("http://localhost:3001/products", {
      name,
      description: desc,
      price: parseFloat(price),
    });
    setName("");
    setDesc("");
    setPrice("");
    alert("Product created!");
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Create Product</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={submit}>Create</button>
    </div>
  );
}
