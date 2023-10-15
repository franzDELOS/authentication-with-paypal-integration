"use client";
import { PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import products from "@/app/products/products.json";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductCardProps } from "@/app/shared/components/ProductCard";

const ProductDetail = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const productId = parseInt(params.id, 10);

  const productDetail = products.products.find(
    (product) => product.id === productId
  );

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createOrder = async (data: any) => {
    try {
      const response = await axios.post(`${apiUrl}/api/orders`, {
        product: {
          price: data.price,
        },
      });

      return response.data.id;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    // Order is captured on the server and the response is returned to the browser
    return fetch(`${apiUrl}/api/orders/${data.orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }).then((response) => {
      router.push("/");
      toast.success("Payment Successful");
      response.json();
    });
  };

  return (
    <section className="py-20 overflow-hidden bg-white font-poppins dark:bg-gray-800">
      <div className="max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full px-4 md:w-1/2 ">
            <div className="sticky top-0 z-50 overflow-hidden ">
              <div className="relative mb-6 lg:mb-10">
                <img
                  src={productDetail?.thumbnail}
                  alt=""
                  className="object-contain w-full h-full "
                />
              </div>
            </div>
          </div>
          <div className="w-full px-4 md:w-1/2 ">
            <div className="lg:pl-20">
              <div className="pb-6 mb-8 border-b border-gray-200 dark:border-gray-700">
                <span className="text-lg font-medium text-rose-500 dark:text-rose-200">
                  New
                </span>
                <h2 className="max-w-xl mt-2 mb-6 text-xl font-bold dark:text-gray-300 md:text-4xl">
                  {productDetail?.title}
                </h2>
                <div className="flex flex-wrap items-center mb-6">
                  <ul className="flex mb-4 mr-2 lg:mb-0">
                    <li>
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="w-4 mr-1 text-red-500 dark:text-gray-400 bi bi-star "
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z" />
                        </svg>
                      </a>
                    </li>
                  </ul>
                  <a
                    className="mb-4 text-xs underline dark:text-gray-400 dark:hover:text-gray-300 lg:mb-0"
                    href="#"
                  >
                    Be the first to review the product
                  </a>
                </div>
                <p className="max-w-md mb-8 text-gray-700 dark:text-gray-400">
                  {productDetail?.description}
                </p>
                <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400 ">
                  <span>${productDetail?.price}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center ">
                <div className="mb-4 mr-4 lg:mb-0">
                  <div className="w-28"></div>
                  <div className="mb-4 mr-4 lg:mb-0">
                    <button className="w-full h-10 p-2 mr-4 bg-blue-500 dark:text-gray-200 text-gray-50 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
                      Buy Now
                    </button>
                    <PayPalButtons
                      createOrder={() => createOrder(productDetail)}
                      onApprove={(data) => onApprove(data)}
                    />
                  </div>
                  <ToastContainer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
