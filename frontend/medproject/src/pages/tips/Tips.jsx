import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTips } from '../../redux/reducers/tipsSlice';
import style from "./Tips.module.css";
import Loader from '../../layouts/components/loader/Loader';

const IMAGE_BASE = "http://localhost:9012/uploads/tips_photo/";

function Tips() {
  const dispatch = useDispatch();
  const tipsState = useSelector(state => state.tips);
  const tips = tipsState.items || tipsState.tips || [];
  const loading = tipsState.loading;

  useEffect(() => {
    dispatch(fetchTips());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={style.tips}>
      <img src="https://jevelin.shufflehound.com/medical/wp-content/uploads/sites/23/2018/09/lady.jpg?id=17" alt="" className={style.tipsImage} />
      <div className={style.tipsList}>
        {tips && tips.map(tip => (
          <div className={style.tip} key={tip._id}>
            <div className={style.tipLeft}>
              <img src={`${IMAGE_BASE}${tip.image}`} alt={tip.title} />
            </div>
            <div className={style.tipRight}>
              <h2>{tip.title}</h2>
              <p>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tips;