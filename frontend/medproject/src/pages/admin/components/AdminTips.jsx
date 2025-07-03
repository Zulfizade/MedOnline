import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTips, addTip, updateTip, deleteTip } from "../../../redux/reducers/tipsSlice";
import styles from "./AdminTips.module.css";
import toast from "../../../utils/toast";

const AdminTips = () => {
  const dispatch = useDispatch();
  const { items: tips, loading } = useSelector(state => state.tips);
  const [form, setForm] = useState({ title: "", description: "", image: null, oldImage: null });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => { dispatch(fetchTips()); }, [dispatch]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm(f => ({ ...f, image: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editId) {
      // If no new image, send oldImage path
      const submitForm = { ...form };
      if (!form.image && form.oldImage) {
        submitForm.keepOldImage = true;
      }
      const res = await dispatch(updateTip({ id: editId, form: submitForm }));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Tip yeniləndi!");
        setEditId(null);
        setForm({ title: "", description: "", image: null, oldImage: null });
        setPreviewImage(null);
        dispatch(fetchTips());
      } else if (res.payload && res.payload.notFound) {
        toast.error("Tip tapılmadı və ya artıq silinib!");
        setEditId(null);
        setForm({ title: "", description: "", image: null, oldImage: null });
        setPreviewImage(null);
        dispatch(fetchTips());
      } else {
        toast.error("Əməliyyat uğursuz oldu!");
      }
    } else {
      const res = await dispatch(addTip(form));
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Tip əlavə olundu!");
        setForm({ title: "", description: "", image: null, oldImage: null });
        setPreviewImage(null);
        dispatch(fetchTips());
      } else {
        toast.error("Əməliyyat uğursuz oldu!");
      }
    }
  };

  const handleEdit = tip => {
    setEditId(tip._id);
    setForm({ title: tip.title, description: tip.description, image: null, oldImage: tip.image });
    setPreviewImage(`http://localhost:9012/${tip.image.replace(/.*uploads[\\/]/, 'uploads/tips_photo/')}`);
  };

  const handleDelete = async id => {
    const res = await dispatch(deleteTip(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Tip silindi!");
      dispatch(fetchTips());
    } else {
      toast.error("Tip silinmədi!");
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.header}>Tips</h3>
      <form className={styles.addTipForm} onSubmit={handleSubmit}>
        <input className={styles.input} name="title" value={form.title} onChange={handleChange} placeholder="Başlıq" required />
        <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Təsvir" required />
        <input className={styles.input} name="image" type="file" accept="image/*" onChange={handleChange} />
        {editId && previewImage && (
          <div style={{ margin: '10px 0' }}>
            <img src={previewImage} alt="current" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
            <div style={{ fontSize: 12, color: '#888' }}>Hazırda seçilmiş şəkil</div>
          </div>
        )}
        <button className={styles.button} type="submit">{editId ? "Yenilə" : "Əlavə et"}</button>
        {editId && <button className={styles.button} type="button" onClick={() => { setEditId(null); setForm({ title: "", description: "", image: null, oldImage: null }); setPreviewImage(null); }}>Ləğv et</button>}
      </form>
      {loading ? <div>Yüklənir...</div> : (
        <>
          <table className={styles.statTable}>
            <thead>
              <tr><th>Şəkil</th><th>Başlıq</th><th>Təsvir</th><th></th></tr>
            </thead>
            <tbody>
              {tips.map(tip => (
                <tr key={tip._id}>
                  <td>
                    <img
                      src={tip.image ? `http://localhost:9012/uploads/tips_photo/${tip.image}` : "/default-avatar.png"}
                      alt="tip"
                      className={styles.tipImageThumb}
                      style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", cursor: "pointer", background: "#f3f3f3" }}
                      onClick={() => tip.image && setModalImage(`http://localhost:9012/uploads/tips_photo/${tip.image}`)}
                    />
                  </td>
                  <td>{tip.title}</td>
                  <td>{tip.description}</td>
                  <td>
                    <div className={styles.tipActions}>
                      <button className={styles.button} onClick={() => handleEdit(tip)}>Düzəliş</button>
                      <button className={styles.button} onClick={() => handleDelete(tip._id)}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {modalImage && (
            <div className={styles.tipImageModal} onClick={() => setModalImage(null)}>
              <img src={modalImage} alt="tip-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminTips;
