import { useState, useEffect } from "react";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
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
            <input value={email} onChange={e => setEmail(e.target.value)} type="text" placeholder="Email" />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    </>
}