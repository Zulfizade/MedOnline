import React, { useState } from "react";
import styles from "./PaymentPlans.module.css";

const cardLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
];

const FakeCardForm = ({ plan, onSuccess, onCancel }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div className={styles.fakeCardModal}>
      <div className={styles.fakeCardContent}>
        <h2 style={{marginBottom:8, fontWeight:700}}>Payment Details</h2>
        <div className={styles.fakeCardLogos}>
          {cardLogos.map((src, i) => (
            <img src={src} alt="card logo" className={styles.fakeCardLogo} key={i} />
          ))}
        </div>
        <form onSubmit={handleSubmit} className={styles.fakeCardForm} autoComplete="off">
          <label>
            Card Number
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value.replace(/[^0-9 ]/g, "").replace(/(\d{4})/g, "$1 ").trim())}
              placeholder="1234 5678 9012 3456"
              required
              maxLength={19}
              inputMode="numeric"
            />
          </label>
          <div style={{display:'flex', gap:'1rem'}}>
            <label style={{flex:1}}>
              Expiry
              <input
                type="text"
                value={expiry}
                onChange={e => setExpiry(e.target.value.replace(/[^0-9/]/g, "").replace(/(\d{2})(\d{0,2})/, "$1/$2").slice(0,5))}
                placeholder="MM/YY"
                required
                maxLength={5}
                inputMode="numeric"
              />
            </label>
            <label style={{flex:1}}>
              CVC
              <input
                type="text"
                value={cvc}
                onChange={e => setCvc(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123"
                required
                maxLength={4}
                inputMode="numeric"
              />
            </label>
          </div>
          <div className={styles.fakeCardActions}>
            <button type="submit">Pay ${plan.price}</button>
            <button type="button" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FakeCardForm;
