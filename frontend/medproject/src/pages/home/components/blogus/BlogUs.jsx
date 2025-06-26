import React from "react";
import style from "./BlogUs.module.css";
import { Link } from "react-router";

const blogs = [
  {
    img: "/blog/summerfoods.jpg",
    title: "Healthy Eating in Summer",
    desc: "Learn how to keep your body balanced and hydrated during hot weather.",
  },
  {
    img: "/blog/vitamin.jpg",
    title: "Are Daily Vitamins Really Necessary?",
    desc: "Understand the truth behind everyday vitamin usage and its actual benefits.",
  },
  {
    img: "/blog/tired.jpg",
    title: "Sleep and Immunity: What's the Connection?",
    desc: "Discover how poor sleep habits can weaken your immune system.",
  },
  {
    img: "/blog/onlinesupport.jpg",
    title: "Get Medical Advice Without Leaving Home",
    desc: "Ask your health questions anytime — no clinic visits required.",
  },
  {
    img: "/blog/recepts.jpg",
    title: "The Benefits of E-Prescriptions",
    desc: "Say goodbye to paper prescriptions — manage everything on your phone.",
  },
];

function BlogUs() {
  return (
    <div className={style.blogUs}>
      <div className={style.grid}>
        {blogs.map((blog, idx) => (
          <div
            className={`${style.card} ${idx < 3 ? style.top : style.bottom}`}
            key={idx}
            style={{ backgroundImage: `url(${blog.img})` }}
          >
            <div className={style.overlay}>
              <h3 className={style.title}>{blog.title}</h3>
              <p className={style.desc}>{blog.desc}</p>
              <Link to="/tips" className={style.readMore}>
                Read more &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogUs;