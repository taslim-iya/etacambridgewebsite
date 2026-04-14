/*
  # Seed initial resources - primers, case studies, and articles

  1. Initial Data
    - Add Stanford and HBS primers
    - Add AJ Wasserstein case studies (tagged as author)
    - Add foundational articles and books

  2. Content Includes
    - Search fund primers from major universities
    - Case studies from different perspectives (searcher, investor, company)
    - Foundational articles on acquisition and entrepreneurship
*/

INSERT INTO resources (title, category, author, description, resource_type) VALUES
-- PRIMERS
('Stanford Search Fund Primer', 'primer', 'Stanford Graduate School of Business', 'Comprehensive research on the search fund model including data on returns, acquisition targets, and searcher backgrounds.', NULL),
('Harvard Business School Acquisitions Primer', 'primer', 'Harvard Business School', 'HBS resources and faculty research on entrepreneurship, acquisitions, and small business ownership.', NULL),
('HEC Paris Entrepreneurship Guide', 'primer', 'HEC Paris', 'Guide to entrepreneurship and venture creation from HEC Paris entrepreneurship program.', NULL),
('INSEAD Search Fund Masterclass', 'primer', 'INSEAD', 'INSEAD masterclass materials covering search funds, acquisition strategy, and entrepreneurship.', NULL),

-- CASE STUDIES (AJ Wasserstein)
('Building Scale Through Acquisition: A Searcher Case Study', 'case_study', 'AJ Wasserstein', 'Detailed case study of a successful search fund acquisition, growth strategy, and scaling operations post-acquisition.', 'searcher'),
('Investor Perspective: Returns and Risk in Search Fund Investments', 'case_study', 'AJ Wasserstein', 'Analysis of investor returns, risk assessment, and investment strategy in search fund deals.', 'investor'),
('Company Perspective: Acquisition by a Search Fund Entrepreneur', 'case_study', 'AJ Wasserstein', 'The company owner and employee perspective on being acquired by a search fund entrepreneur.', 'company'),
('Due Diligence Deep Dive: Evaluating Small Business Acquisition Targets', 'case_study', 'AJ Wasserstein', 'Comprehensive guide to due diligence process for search fund acquisitions.', 'searcher'),
('Post-Acquisition Integration: First 100 Days', 'case_study', 'AJ Wasserstein', 'Case study examining the critical first 100 days following a search fund acquisition.', 'searcher'),

-- ARTICLES
('The Search Fund Model: An Alternative Path to Entrepreneurship', 'article', NULL, 'Overview of the search fund model as an alternative to starting from scratch or traditional venture capital paths.', NULL),
('Financing Your Search: Capital Raising for Searchers', 'article', NULL, 'Guide to raising capital for your search fund, investor expectations, and term structures.', NULL),
('Finding the Right Acquisition Target: Search Strategy and Market Analysis', 'article', NULL, 'Methodologies for identifying, researching, and evaluating potential acquisition targets.', NULL),
('Negotiating and Closing the Deal: From LOI to Closing', 'article', NULL, 'Step-by-step guide to deal negotiation, legal structures, and closing the acquisition.', NULL),

-- BOOKS
('The Lean Startup: How Today''s Entrepreneurs Use Continuous Innovation', 'book', 'Eric Ries', 'While not specific to search funds, essential reading on building and scaling businesses efficiently.', NULL),
('Good to Great: Why Some Companies Make the Leap and Others Don''t', 'book', 'Jim Collins', 'Timeless insights on what separates great companies from good ones - relevant for post-acquisition growth.', NULL),
('The Founder''s Mentality: How to Overcome the Predictable Crises of Growth', 'book', 'Chris Zook and James Allen', 'McKinsey perspective on scaling businesses and overcoming growth challenges post-acquisition.', NULL),
('Traction: Get a Grip on Your Business', 'book', 'Gino Wickman', 'Practical guide to business systems, management, and scaling - invaluable for search fund acquisitions.', NULL)
ON CONFLICT DO NOTHING;
