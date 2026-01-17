import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
    const { user, setUser } = useContext(Context);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [bio, setBio] = useState(user?.profile?.bio || "");
    const [location, setLocation] = useState(user?.profile?.location || "");
    const [skills, setSkills] = useState(user?.profile?.skills?.join(",") || "");
    const [resume, setResume] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("bio", bio);
        formData.append("location", location);
        formData.append("skills", skills);
        if (resume) {
            formData.append("resume", resume);
        }

        try {
            const { data } = await axios.put("http://0.0.0.0:3000/api/v1/user/update", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });
            setUser(data.user);
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <section className="profile page">
            <div className="container">
                <h3>My Profile</h3>
                <form onSubmit={handleUpdate}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Phone</label>
                        <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Location</label>
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label>Resume (Optional)</label>
                        <input type="file" onChange={(e) => setResume(e.target.files[0])} />
                    </div>
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </section>
    );
};

export default Profile;
