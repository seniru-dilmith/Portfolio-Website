import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ArticleSearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const ArticleSearch: React.FC<ArticleSearchProps> = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search articles..."
                className="pl-10 h-11 bg-background/50 border-input/50 focus:bg-background transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
    );
};

export default ArticleSearch;
