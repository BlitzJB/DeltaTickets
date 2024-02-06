import { useState, useEffect } from "react";

export default function Login() {

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, password }),
        });
        if (res.ok) {
            window.location.href = "/";
        } else {
            const json = await res.json();
            alert(json.message);
        }
    }

    return <>
        <div>
            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Name" />
            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={handleRegister}>Register</button>
        </div>
    </>
}