import { useCurrentUser } from "~/utils/auth";


export default function Home() {
    const { user, loading, error } = useCurrentUser();
    return (<>
        <div>
            <h1>Home</h1>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
            <a href="/logout">Logout</a>
        </div>

        { JSON.stringify({ user, loading, error }) }
    </>);
}
