// Weather icons component
const WeatherIcon = ({ condition }) => {
    const baseIconClass = "w-8 h-8";

    switch (condition?.toLowerCase()) {
        case 'sunny':
        case 'clear':
            return (
                <svg className={`${baseIconClass} text-orange-500 dark:text-orange-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
            );
        case 'cloudy':
        case 'partly cloudy':
        case 'overcast':
            return (
                <svg className={`${baseIconClass} text-gray-600 dark:text-[#888888]`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" />
                </svg>
            );
        case 'rainy':
        case 'rain':
        case 'drizzle':
            return (
                <svg className={`${baseIconClass} text-blue-600 dark:text-blue-400`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" />
                    <path d="M8.25 21.75A.75.75 0 019 21h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-.008zM8.25 18.75A.75.75 0 019 18h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-.008zM11.25 21.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008zM11.25 18.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008zM14.25 21.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-.008z" />
                </svg>
            );
        case 'snowy':
        case 'snow':
            return (
                <svg className={`${baseIconClass} text-slate-400 dark:text-slate-300`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" />
                    <path d="M8.25 21.75A.75.75 0 019 21h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-.008zM8.25 18.75A.75.75 0 019 18h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-.008zM11.25 21.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H12a.75.75 0 01-.75-.75v-.008zM14.25 21.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-.008z" />
                </svg>
            );
        default:
            return (
                <svg className={`${baseIconClass} text-gray-600 dark:text-[#888888]`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" />
                </svg>
            );
    }
};

// Location icon component
const LocationIcon = () => (
    <svg className="w-4 h-4 text-gray-500 dark:text-[#888888]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
    </svg>
);

export function Weather({ weather, temperature, location }) {
    // Parse temperature to handle different formats
    const tempValue = typeof temperature === 'string' ?
        parseFloat(temperature.replace(/[^\d.-]/g, '')) : temperature;

    const tempUnit = typeof temperature === 'string' && temperature.includes('°F') ? '°F' : '°C';

    return (
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#262626] rounded-lg p-6 transition-colors duration-200">
            {/* Header with weather icon and condition */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <WeatherIcon condition={weather} />
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-[#ededed] capitalize">
                            {weather || 'Unknown'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-[#888888]">Current conditions</p>
                    </div>
                </div>

                {/* Temperature display */}
                <div className="text-right">
                    <div className="text-3xl font-medium text-gray-900 dark:text-[#ededed]">
                        {tempValue ? `${Math.round(tempValue)}${tempUnit}` : 'N/A'}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-[#888888]">Temperature</p>
                </div>
            </div>

            {/* Location */}
            {location && (
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-[#262626]">
                    <LocationIcon />
                    <span className="text-sm font-medium text-gray-700 dark:text-[#a1a1a1]">
                        {location}
                    </span>
                </div>
            )}
        </div>
    )
}