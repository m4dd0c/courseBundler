import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../redux/store";
import { buySubscriptionAction } from "../../redux/actions/subscriptionActions";

const Subscribe = ({ user }) => {
  const dispatch = useDispatch();
  const [key, setKey] = useState("");

  const { subscriptionId } = useSelector((state) => state.subscriptionReducer);

  const subscribeHandler = async () => {
    const { data } = await axios.get(`${server}/getrazorpaykey`);
    setKey(data.key);
    dispatch(buySubscriptionAction());
  };

  useEffect(() => {
    if (subscriptionId) {
      const openPopUp = () => {
        const options = {
          key,
          name: "CourseBundler",
          description: "Get access to all courses",
          // image : logo,

          subscription_id: subscriptionId,
          callback_url: `${server}/paymentverification`,
          prefill: {
            name: user.name,
            email: user.email,
            contact: "",
          },
          notes: {
            addess: "Rajasthan",
          },
          theme: {
            color: "grey",
          },
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
        // console.log(options);
      };
      openPopUp();
    }
  }, [dispatch, user.name, user.email, key, subscriptionId]);
  return (
    <>
      <div className="bg-lightColor min-h-[680px]">
        <h1 className="text-center text-5xl text-white py-10 font-bold">
          Get Subscription
        </h1>
        <p className="text-dullWhite text-center capitalize">
          Get lifetime subscription only in 500/-
        </p>
        <div className="grid place-content-center ">
          <div className="flex justify-center">
            <img
              src="images/subscription/subscribe.png"
              alt=""
              className="w-1/2 p-10 "
            />
          </div>
          <div className=" flex justify-center">
            <button
              className="cursor-pointer hover:bg-green-700 bg-greenColor rounded-sm w-1/2 h-[35px] outline-none p-2 text-center text-white"
              onClick={subscribeHandler}
            >
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscribe;
