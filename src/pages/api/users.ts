import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
    const users = await fetch('https://jsonplaceholder.typicode.com/users')
        .then(response => response.json())

    return new Response(
        JSON.stringify({
            users
        }),
        { status: 200 }
    )
}

