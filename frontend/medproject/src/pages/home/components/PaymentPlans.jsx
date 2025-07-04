import React from "react";
import axios from "../../../redux/axiosInstance";
import styles from "./PaymentPlans.module.css";
import { toast } from "react-toastify";

const plans = [
  { name: "Free Customer", price: 0, doctorLimit: 10, mailLimit: 5, color: "#bdbdbd" },
  { name: "Pro Patient", price: 15, doctorLimit: 100, mailLimit: 20, color: "#3B82F6" },
  { name: "VIP Patient", price: 30, doctorLimit: 200, mailLimit: 50, color: "#F472B6" }
];

const PaymentPlans = () => {
  const handlePayment = async (plan) => {
    if (plan.price === 0) return;
    const res = await axios.post("/api/payment/create-checkout-session", { plan: plan.name.toLowerCase().split(' ')[0] });
    window.location.href = res.data.url;
  };

  return (
    <div className={styles.paymentSection}>
      <h2>Choose Your Plan</h2>
      <div className={styles.plans}>
        {plans.map(plan => (
          <div className={styles.plan} style={{ borderColor: plan.color }} key={plan.name}>
            <h3 style={{ color: plan.color }}>{plan.name}</h3>
            <div className={styles.price}>{plan.price === 0 ? "Free" : `$${plan.price}/month`}</div>
            <ul>
              <li>{plan.doctorLimit} doctor chat/month</li>
              <li>{plan.mailLimit} support mails/month</li>
            </ul>
            <button
              style={{ background: plan.color, color: "#fff" }}
              onClick={() => handlePayment(plan)}
              disabled={plan.price === 0}
            >
              {plan.price === 0 ? "Current Plan" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPlans;
