import { useEffect } from "react"

export default function Logout() {
    useEffect(() => {
        fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
        }).then(res => {
            if (res.ok) {
                window.location.href = "/"
            }
        })
    }, []);
    return (<>Logging you out...</>);
}