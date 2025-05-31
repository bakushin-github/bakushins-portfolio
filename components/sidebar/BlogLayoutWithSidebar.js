import SidebarAuthorCard from './SidebarAuthorCard';
import styles from './BlogLayoutWithSidebar.module.scss';

export default function BlogLayoutWithSidebar({ 
  children, 
  articleTitle, 
  articleUrl 
}) {
  return (
    <div className={styles.blogLayoutWithSidebar}>
      {/* メインコンテンツ */}
      <main className={styles.blogMainContent}>
        {children}
      </main>

      {/* サイドバー */}
      <aside className={styles.blogSidebar}>
        <SidebarAuthorCard 
          articleTitle={articleTitle}
          articleUrl={articleUrl}
        />

      </aside>
    </div>
  );
}