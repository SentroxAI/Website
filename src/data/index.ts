/* -------------------------------------------------------------------------- */
/*                          DATA BARREL EXPORTS                               */
/*                                                                            */
/*  Clean re-exports so consumers can import from "@/data" instead of         */
/*  reaching into component directories.                                      */
/* -------------------------------------------------------------------------- */

export {
    blogPosts,
    blogCategories,
    getPostBySlug,
    getFeaturedPosts,
    type BlogPost,
} from "@/components/blog/blogData";

export { servicesData } from "@/components/services/servicesData";

export {
    portfolioProjects,
    categories as portfolioCategories,
    type PortfolioProject,
} from "@/components/portfolio/portfolioData";
