const api_key = 'eyJraWQiOiI5NzIxYmUzNi1iMjcwLTQ5ZDUtOTc1Ni05ZDU5N2M4NmIwNTEiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhdXRoLXNlcnZpY2UtYjBkYjI3ZWQtYzE2Ny00MWRjLWFjNWUtYzk2NDBmN2RjYmIzIiwiYXVkIjoiNDU4MDM2Mjk2MDE1MTAxIiwibmJmIjoxNzIwMzQwMzExLCJzY29wZSI6WyJiMmItYXBpLmdlbl9haSIsImIyYi1hcGkuaW1hZ2VfYXBpIl0sImlzcyI6Imh0dHBzOi8vYXBpLnBpY3NhcnQuY29tL3Rva2VuLXNlcnZpY2UiLCJvd25lcklkIjoiNDU4MDM2Mjk2MDE1MTAxIiwiaWF0IjoxNzIwMzQwMzExLCJqdGkiOiJmZTE0NjlkNy0xOWJlLTRiNzgtYjIwNS0yYjM2MmUxOGY0OWYifQ.kHTTVcqwnDeh9M1X2i6Dod58Xitfn0oxiHGx84t1dfEDeS8JD4BQGlsnD-i0ETv6NwLJuRdkjmgv5Orle3tOYGYpjC71K3nwYZjc6WGzKCu6FNeb2wondZzzzlQM5pQOAb9AJ4DivLyxMb9NTjFkZR-Cw9B8hl2PtG0ZEtqzexRC7b0sYWTi2cJKPuSqyJlJfkzHTfqhMwQdqcChYN3qjSXmhUK-Ebf6YIm2ETLQfDj4xhjHd_-4hEGH-jUs98Vs7gj8_tFZgX5cPuTZ1sp5RxRiSNZqJNl7OrViQ89JhvKH513UZMRmvYgHNkE3-TXTiT6ZRmzEM3RmxfqLTDMtNA';

export async function removeBG(imgSrc){
    const api_url = 'https://api.picsart.io/tools/1.0/removebg';

    const res = await fetch(api_url,{
        method:"POST",
        headers: {
            'accept':'application/json',
            'X-Picsart-API-Key': api_key,
        },
        body: convertFormData({
            "output_type": "cutout",
            "bg_blur": "0",
            "scale": "fit",
            "auto_center": "false",
            "stroke_size": "0",
            "stroke_color": "FFFFFF",
            "stroke_opacity": "100",
            "format": "PNG",
            "image_url": imgSrc
          }),
    });

    return await res.json();
}




// ---- HELPERS ----

function convertFormData(obj){
    const formData = new FormData();
    for(let key in obj)
    {
        formData.append(key, obj[key]);
    }
    return formData;
}


