let CACHE_NAME = "sw-v1";
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.add("404.html"))
	);
});
self.addEventListener("fetch", (event) => {
	if (event.request.method === "GET") {
		event.respondWith(
			caches.match(event.request).then((cached) => {
				const networked = fetch(event.request)
					.then((response) => {
						let cacheCopy = response.clone();
						caches
							.open(CACHE_NAME)
							.then((cache) => cache.put(event.request, cacheCopy));
						return response;
					})
					.catch(() => caches.match(offlinePage));
				return cached || networked;
			})
		);
	}
	return;
});

//  Cache - Control: max - age=31536000
