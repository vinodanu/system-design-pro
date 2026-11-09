const BASE_PATH =
    process.env.NEXT_PUBLIC_BASE_PATH || "";

export function assetPath(path: string): string {
    if (!path) return "";

    if (
        path.startsWith("http://") ||
        path.startsWith("https://") ||
        path.startsWith("data:")
    ) {
        return path;
    }

    const normalizedPath = path.startsWith("/")
        ? path
        : `/${path}`;

    if (
        BASE_PATH &&
        (normalizedPath === BASE_PATH ||
            normalizedPath.startsWith(`${BASE_PATH}/`))
    ) {
        return normalizedPath;
    }

    return `${BASE_PATH}${normalizedPath}`;
}