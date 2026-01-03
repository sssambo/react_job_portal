import React from "react";
import { useContext } from "react";
import { Context } from "../../main";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";
import PopularCompanies from "./PopularCompanies";

const Home = () => {
	// Guests can now view the home page
	return (
		<>
			<section className="homePage page">
				<HeroSection />
				<HowItWorks />
				<PopularCategories />
				<PopularCompanies />
			</section>
		</>
	);
};

export default Home;
