type TopBannerProps = {
  text: string;
  enabled: boolean;
};

const TopBanner = ({ text, enabled }: TopBannerProps) => {
  if (!enabled || !text) {
    return null;
  }

  return (
    <div className="bg-primary text-white text-center py-2.5 px-4 text-sm z-50 relative">
      <p className="font-body" dangerouslySetInnerHTML={{ __html: text }}></p>
    </div>
  );
};

export default TopBanner;
