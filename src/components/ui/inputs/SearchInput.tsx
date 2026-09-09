"use client";

import {
    forwardRef,
    useCallback,
    useState,
    type InputHTMLAttributes,
} from "react";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { debounce } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface SearchInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> {
    onSearch?: (value: string) => void;
    onChange?: (value: string) => void;
    debounceMs?: number;
    size?: "sm" | "md" | "lg";
    showClear?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                              SIZE CLASSES                                  */
/* -------------------------------------------------------------------------- */

const sizes = {
    sm: "px-4 py-2 pl-10 pr-10 text-sm",
    md: "px-5 py-3.5 pl-12 pr-12 text-base",
    lg: "px-6 py-4 pl-14 pr-14 text-lg",
};

const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};

const iconPositions = {
    sm: "left-3",
    md: "left-4",
    lg: "left-5",
};

const clearPositions = {
    sm: "right-3",
    md: "right-4",
    lg: "right-5",
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
    (
        {
            className,
            onSearch,
            onChange,
            debounceMs = 300,
            size = "md",
            showClear = true,
            placeholder = "Search...",
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = useState(
            (props.value as string) ?? ""
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
        const debouncedSearch = useCallback(
            debounce((value: string) => {
                onSearch?.(value);
            }, debounceMs),
            [onSearch, debounceMs]
        );

        const handleChange = (value: string) => {
            setInternalValue(value);
            onChange?.(value);
            debouncedSearch(value);
        };

        const handleClear = () => {
            setInternalValue("");
            onChange?.("");
            onSearch?.("");
        };

        return (
            <div className="relative w-full">
                {/* Search Icon */}

                <Search
                    className={cn(
                        "pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-500",
                        iconSizes[size],
                        iconPositions[size]
                    )}
                />

                {/* Input */}

                <input
                    ref={ref}
                    type="search"
                    value={internalValue}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e.target.value)}
                    className={cn(
                        "w-full rounded-2xl border border-white/10 bg-white/5 text-white",
                        "backdrop-blur-xl outline-none",
                        "placeholder:text-slate-500",
                        "transition-all duration-300",
                        "hover:border-white/20",
                        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                        "[&::-webkit-search-cancel-button]:hidden",
                        sizes[size],
                        className
                    )}
                    {...props}
                />

                {/* Clear Button */}

                {showClear && internalValue && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-white",
                            clearPositions[size]
                        )}
                    >
                        <X className={iconSizes[size]} />
                    </button>
                )}
            </div>
        );
    }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
