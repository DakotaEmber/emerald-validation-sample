/**
 * Basic function for building a css classlist string from and array of classes, where
 * one of more of the arguments may be null or undefined.
 *
 * @param classes Array of strings the represents the css class list.
 *
 * @example css("base", "active", x === 42 && "optional") will return "base active optional" if x === 42 or "base active" otherwise
 */
export function css(...classes: Array<string | undefined | null | false>): string {
    return classes
        .filter((c) => c)
        .join(" ")
        .trim();
}
