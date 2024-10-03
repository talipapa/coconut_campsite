'use client'

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id'); // Access the 'id' query parameter

    if (!id) {
        return <div>Invalid URL</div>;
    }

    useEffect(() => {
        // Use the id from query to find transaction details from the api

        // Receive the response from the api

        // If the transaction is not found, redirect to booking page

        // (For online booking)If the transaction is found

        // Update the UI with the response

        
    }, []);

    return (
        <div>
            {id}
            <img src="/img/camping.gif" alt="" />

        </div>
    );
}