import { cookies } from "next/headers";


const getData = async () => {
    // MAKE SURE REFERER IS PROPERLY SET IN HEADERS OR YOU WILL BE LIKE ME DEBUGGING THIS FOR HALF A DAY
    let fetch_path = process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v1/booking"

    await fetch("http://localhost:8000/sanctum/csrf-cookie")

    const options = {
        method: "GET",
        credentials: "include",
        headers: {
            'Accept' : "application/json",
            'Referer' : process.env.APP_URL,
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/json",
            Cookie: "XSRF-TOKEN=" + cookies().get('XSRF-TOKEN').value + ";laravel_session="+cookies().get('laravel_session').value,
            Authorization: "Bearer " + cookies().get('XSRF-TOKEN').value

        },
    }

    const response = await fetch(fetch_path, options);
    return response.json();
}


export default async function Page() {
    const booking = await getData();
    console.log(booking);

    return (
        <>
            <div>This is where the user can edit their booking</div>
        </>
    );
}