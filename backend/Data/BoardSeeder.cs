using backend.Data;
using YourProject.Models;


public static class BoardSeeder
{
  
public static async Task<string> SeedMarketingCampaignBoardAsync(ApplicationDbContext context, string userId)
{
    string boardId = Guid.NewGuid().ToString();
    string list1Id = Guid.NewGuid().ToString(); // Idea Generation & Research
    string list2Id = Guid.NewGuid().ToString(); // Strategic Planning
    string list3Id = Guid.NewGuid().ToString(); // To Do
    string list4Id = Guid.NewGuid().ToString(); // Content Production
    string list5Id = Guid.NewGuid().ToString(); // Design & Media Prep
    string list6Id = Guid.NewGuid().ToString(); // In Progress
    string list7Id = Guid.NewGuid().ToString(); // Review
    string list8Id = Guid.NewGuid().ToString(); // Pre-Launch
    string list9Id = Guid.NewGuid().ToString(); // Completed

    var board = new Board
    {
        Id = boardId,
        Name = "Marketing Campaign",
        ColorId = 1,
        UserId = userId,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };

    var lists = new[]
    {
        new List { Id = list1Id, Name = "Idea Generation & Research", BoardId = boardId, Position = 1 },
        new List { Id = list2Id, Name = "Strategic Planning", BoardId = boardId, Position = 2 },
        new List { Id = list3Id, Name = "To Do", BoardId = boardId, Position = 3 },
        new List { Id = list4Id, Name = "Content Production", BoardId = boardId, Position = 4 },
        new List { Id = list5Id, Name = "Design & Media Prep", BoardId = boardId, Position = 5 },
        new List { Id = list6Id, Name = "In Progress", BoardId = boardId, Position = 6 },
        new List { Id = list7Id, Name = "Review", BoardId = boardId, Position = 7 },
        new List { Id = list8Id, Name = "Pre-Launch", BoardId = boardId, Position = 8 },
        new List { Id = list9Id, Name = "Completed", BoardId = boardId, Position = 9 }
    };

    // Descriptions ~50-100 words each. Color coding strategy:
    // Idea Generation & Research: mostly null or ColorId = 1
    // Strategic Planning: ColorId = 6 (planning/strategy)
    // To Do: ColorId = 1 or 2 (backlog tasks)
    // Content Production: ColorId = 2 or 3 (writing tasks)
    // Design & Media Prep: ColorId = 4 or 5 (design tasks)
    // In Progress: Mixed colors, reflecting current work
    // Review: Mostly no color or low-color, let's pick ColorId = null or 1
    // Pre-Launch: ColorId = 1 or null (final checks)
    // Completed: Vary colors to reflect finished tasks

    var tickets = new[]
    {
        // IDEA GENERATION & RESEARCH (list1)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Initial Market Landscape Review", ListId = list1Id,
            Description = "Conduct an in-depth review of the current market landscape by examining recent industry reports, competitor case studies, and emerging consumer trends. Identify key areas where our brand can differentiate itself, focusing on messaging, product features, and value propositions. Document these insights to guide subsequent planning stages and ensure our strategies align with actual market conditions.",
            ColorId = null, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Audience Persona Brainstorm", ListId = list1Id,
            Description = "Gather a cross-functional team to brainstorm audience personas that represent key segments of our target market. Consider demographics, interests, pain points, and preferred communication channels. Create detailed persona profiles, each including backstory and motivations. These personas will later inform our messaging, content creation, and channel selection, ensuring that every campaign element resonates authentically with our intended audience.",
            ColorId = 1, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Competitive Positioning Analysis", ListId = list1Id,
            Description = "Examine our top three competitors, assessing their brand voice, content strategy, and campaign performance. Identify unique selling points and subtle differentiators that we can emphasize. Summarize findings in a concise report, highlighting opportunities to position our brand more effectively.",
            ColorId = null, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Creative Concept Ideation", ListId = list1Id,
            Description = "Host a creative workshop where the team pitches new campaign concepts, including tagline ideas, storytelling angles, and interactive elements. Encourage diverse input, from humorous social media hooks to data-driven infographics. Narrow down concepts to a shortlist that aligns with our brand’s voice, values, and overarching goals. Document these ideas for later refinement.",
            ColorId = 1, Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Preliminary Influencer Identification", ListId = list1Id,
            Description = "Research industry thought leaders, niche bloggers, and social media influencers whose audiences match our target demographics. Compile a preliminary list of potential partners, noting their follower counts, engagement rates, and content themes. This initial roster will guide future influencer outreach, collaborations, and content co-creation opportunities.",
            ColorId = null, Position = 5
        },
        new Ticket {
      Id = Guid.NewGuid().ToString(),
      Name = "User Insight Interviews",
      ListId = list1Id,
      Description = "Schedule a series of short, qualitative interviews with potential customers. Focus on their daily challenges, aspirations, and common misconceptions about our product category. Document these conversations to uncover hidden motivators and barriers, allowing us to tailor our messaging and campaign approach. Each insight drawn from these interviews can sharpen our strategic direction.",
      ColorId = null,
      Position = 6
  },
  new Ticket {
      Id = Guid.NewGuid().ToString(),
      Name = "Trend Scouting Report",
      ListId = list1Id,
      Description = "Compile a monthly report highlighting emerging trends, cultural shifts, and influential voices in our market space. These findings serve as a creative springboard, inspiring new ideas and prompting discussions on how to remain relevant. Encouraging the team to think ahead ensures we create a campaign that anticipates audience needs, rather than merely reacting.",
      ColorId = 1,
      Position = 7
  },
  new Ticket {
      Id = Guid.NewGuid().ToString(),
      Name = "Data Visualization Brainstorm",
      ListId = list1Id,
      Description = "Host a brainstorming session on transforming complex research data into easy-to-understand visuals. Consider charts, interactive maps, or animated graphics that highlight key insights. This exercise helps the team find fresh angles for presenting information, ensuring that our audience quickly grasps our core messages and feels engaged by the content’s clarity and creativity.",
      ColorId = null,
      Position = 8
  },
  new Ticket {
      Id = Guid.NewGuid().ToString(),
      Name = "Micro-Communities Exploration",
      ListId = list1Id,
      Description = "Investigate niche online communities, industry forums, and local meetups where our target persona congregates. Document common discussion themes, frequently asked questions, and shared resources. Understanding these micro-communities can guide our messaging, content hooks, and outreach strategies, ensuring that our campaign resonates at a grassroots level and reaches highly interested segments.",
      ColorId = 1,
      Position = 9
  },

        // STRATEGIC PLANNING (list2)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Detailed Marketing Plan Creation", ListId = list2Id,
            Description = "Draft a comprehensive marketing plan outlining campaign objectives, target audience segments, channel strategies, and key performance indicators. Break down each initiative into actionable steps with clear responsibilities and timelines. This plan will serve as a strategic roadmap, ensuring that the entire team remains aligned, focused, and prepared.",
            ColorId = 6, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Budget Allocation & Approval", ListId = list2Id,
            Description = "Develop a detailed budget that allocates resources to paid ads, influencer partnerships, content creation, design services, and analytics tools. Present this budget to finance and leadership for approval. Provide justifications for each expense, ensuring stakeholder confidence that investments will yield measurable returns.",
            ColorId = 6, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Timeline & Milestone Setup", ListId = list2Id,
            Description = "Construct a realistic timeline, detailing critical milestones such as content drafts due, design reviews, platform integrations, and final approvals. Incorporate buffer periods to accommodate unexpected delays. This structured schedule ensures every team member understands deadlines and can plan their workloads accordingly, reducing bottlenecks and last-minute scrambles.",
            ColorId = 6, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Key Messaging Framework", ListId = list2Id,
            Description = "Develop a core messaging framework that highlights our brand’s value proposition, unique tone, and key differentiators. This framework guides all communications, from blog posts and social captions to landing page headlines. With consistent messaging, we reinforce brand identity, build trust, and ensure our campaigns resonate at every touchpoint.",
            ColorId = 6, Position = 4
        },

        // TO DO (list3)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Research Competitors", ListId = list3Id,
            Description = "Dive deeper into competitor strategies by analyzing their recent ad campaigns, sponsored posts, and backlink profiles. Identify recurring themes or successful tactics worth adopting or improving upon. Summarize these insights to guide adjustments to our own approach, ensuring we stay one step ahead and differentiate ourselves effectively.",
            ColorId = 2, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Platform Selection Audit", ListId = list3Id,
            Description = "Evaluate which social networks, content platforms, and marketing channels are best suited for reaching our target audience. Consider factors like user demographics, engagement features, and advertising options. Compile recommendations, including priority platforms and secondary channels, to streamline our efforts and maximize the impact of each campaign initiative.",
            ColorId = 1, Position = 2
        },

        // CONTENT PRODUCTION (list4)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Write Blog Posts", ListId = list4Id,
            Description = "Produce a series of in-depth blog articles that educate and inspire our target audience. Each post should present valuable insights, research findings, and actionable tips. Incorporate our core messaging and focus keywords to improve searchability. These blog posts will serve as a content backbone, driving organic traffic and nurturing leads.",
            ColorId = 3, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Draft Newsletter", ListId = list4Id,
            Description = "Craft a monthly newsletter outlining upcoming promotions, newly published content, and behind-the-scenes campaign highlights. Aim to engage subscribers with a friendly, conversational tone and compelling visuals. Highlight key achievements, invite feedback, and maintain a sense of exclusivity, encouraging recipients to remain loyal.",
            ColorId = 2, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Long-Form Whitepaper Creation", ListId = list4Id,
            Description = "Develop a detailed whitepaper offering in-depth analysis, expert commentary, and data-driven insights on our campaign’s subject matter. Incorporate original research, charts, and case studies. This high-value asset can serve as gated content, helping capture leads and establish our brand as a thought leader in the marketplace.",
            ColorId = 3, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Social Media Post Calendar", ListId = list4Id,
            Description = "Plan and draft a calendar of social media posts spanning multiple weeks. Each post should align with our messaging framework, highlight key content pieces, and engage followers through questions, polls, or visuals. This proactive approach ensures a consistent social presence that reinforces our brand narrative over time.",
            ColorId = 2, Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Infographic Copy Draft", ListId = list4Id,
            Description = "Write concise, impactful text for a series of infographics that transform complex data into visual stories. Focus on clarity, accuracy, and an approachable tone. This carefully crafted copy will support our designers in producing infographics that captivate viewers, convey value, and bolster our content mix with shareable assets.",
            ColorId = 3, Position = 5
        },
        new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Long-Form Case Study Draft",
    ListId = list4Id,
    Description = "Develop a detailed case study showcasing a client’s journey, highlighting initial challenges, the solutions we provided, and quantifiable outcomes. Weave in compelling storytelling elements and supporting data. This narrative, once polished, will act as persuasive content, demonstrating credibility and reinforcing our brand’s promise of delivering tangible value.",
    ColorId = 3,
    Position = 6
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Podcast Script Outline",
    ListId = list4Id,
    Description = "Outline a structured podcast episode featuring industry experts and thought leaders. Include an introduction, a series of interview questions, and key talking points that align with our brand message. The final script ensures that when we record, conversations feel natural yet informative, guiding listeners through valuable insights they can’t easily find elsewhere.",
    ColorId = 2,
    Position = 7
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Social Caption Variations",
    ListId = list4Id,
    Description = "Draft multiple variants of captions for upcoming social posts. Experiment with humor, empathy, and problem-solving angles. By testing different narratives and calls-to-action, we can discover which tones resonate most, ensuring that every final caption sparks meaningful engagement while staying true to our campaign’s core themes.",
    ColorId = 3,
    Position = 8
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Expert Roundup Article",
    ListId = list4Id,
    Description = "Create a long-form article featuring quotes and insights from multiple industry experts. Introduce the topic with context, then seamlessly integrate each expert’s perspective, ensuring a cohesive reading experience. This content positions our brand as a convener of valuable opinions, reinforcing our authority and fueling richer audience conversations.",
    ColorId = 2,
    Position = 9
},

        // DESIGN & MEDIA PREP (list5)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Design Landing Page", ListId = list5Id,
            Description = "Create a visually appealing landing page that clearly communicates our offer, highlights value propositions, and includes compelling CTAs. Use color schemes, iconography, and layouts that reflect our brand identity. This page should guide visitors smoothly towards the desired action, whether signing up, downloading content, or exploring our products.",
            ColorId = 4, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Create Social Media Graphics", ListId = list5Id,
            Description = "Design a series of attention-grabbing graphics for social platforms. Utilize brand colors, typography, and cohesive visual themes. Each graphic should reinforce our messaging and prompt engagement. These assets ensure a consistent brand experience across channels, enticing viewers to learn more about our campaign and offerings.",
            ColorId = 5, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Video Storyboard Development", ListId = list5Id,
            Description = "Draft a storyboard for a short promotional video. Outline scenes, transitions, voiceover scripts, and on-screen text. Ensure that the visual narrative flows logically, communicates our key messages, and holds the viewer’s attention throughout. This preparation streamlines production and ensures the final video resonates with target audiences.",
            ColorId = 4, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Email Template Design", ListId = list5Id,
            Description = "Develop a visually appealing email template that reflects our brand’s look and feel. Incorporate responsive design elements, easy-to-read typography, and strategically placed CTAs. A well-designed template improves open and click-through rates, making it easier to deliver updates and offers that encourage recipients to take meaningful actions.",
            ColorId = 5, Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Interactive Quiz Mockup", ListId = list5Id,
            Description = "Create a mockup for an interactive quiz designed to engage prospects and gather insights. Include playful visual elements, user-friendly navigation, and a results screen that drives participants to learn more about our brand. This interactive feature can deepen user engagement, highlight product relevance, and spark social sharing.",
            ColorId = 4, Position = 5
        },

        // IN PROGRESS (list6)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Social Media Campaign", ListId = list6Id,
            Description = "Launch a coordinated social media effort featuring scheduled posts, Stories, and short videos. Continuously monitor engagement metrics and respond to user interactions. Adjust the campaign’s messaging or frequency based on performance insights, ensuring that our brand remains dynamic, conversational, and well-tuned to audience preferences.",
            ColorId = 2, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Collaborate with Video Editor", ListId = list6Id,
            Description = "Work closely with a freelance video editor to finalize promotional clips. Provide feedback on pacing, transitions, text overlays, and sound design. Aim for a polished final output that conveys professionalism and aligns with our campaign’s storytelling goals, helping to captivate viewers and boost brand perception.",
            ColorId = 4, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Revise Draft Newsletter", ListId = list6Id,
            Description = "Review the current newsletter draft for clarity, tone, and alignment with key messages. Make necessary edits to headlines, body copy, and CTAs. Ensure that the content feels timely, relevant, and actionable. Once revised, this newsletter will be poised for distribution to subscribers and stakeholders.",
            ColorId = 3, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Optimize Blog Posts for SEO", ListId = list6Id,
            Description = "Enhance existing blog drafts by integrating primary keywords, improving meta descriptions, and refining headlines for better click-through rates. Ensure the text reads naturally and provides genuine value. This optimization effort aims to improve search rankings, draw more organic traffic, and keep readers engaged on our site.",
            ColorId = 2, Position = 4
        },

        // REVIEW (list7)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Review Infographic Copy", ListId = list7Id,
            Description = "Examine the infographic text for accuracy, brevity, and narrative flow. Confirm that each data point is correctly represented and that the tone matches the brand voice. Offer suggestions for improvements if needed. Once finalized, this copy will be passed to designers for integration into the final visual asset.",
            ColorId = 1, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Review Landing Page Design", ListId = list7Id,
            Description = "Evaluate the landing page mockup, ensuring that colors, imagery, and layout present a cohesive brand experience. Check that CTAs are prominent and that navigation is intuitive. Provide constructive feedback for refinements. Once approved, the design moves closer to implementation and eventual deployment to engage potential customers.",
            ColorId = null, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Review Messaging Framework", ListId = list7Id,
            Description = "Carefully read through the messaging framework, verifying consistency in tone and clarity of value propositions. Confirm that key themes resonate with identified audience segments. Suggest adjustments where language feels vague or redundant. Approved messaging will serve as a stable foundation for all brand communications moving forward.",
            ColorId = null, Position = 3
        },
        new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Review Whitepaper Draft",
    ListId = list7Id,
    Description = "Assess the current whitepaper draft’s structure, clarity, and data visualization. Verify that the research is accurately represented and conclusions logically follow the presented evidence. Provide feedback on flow and tone, ensuring the final version reads smoothly and stands as a credible, authoritative resource that informs and persuades our audience.",
    ColorId = null,
    Position = 4
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Review Video Storyboard",
    ListId = list7Id,
    Description = "Examine the proposed storyboard for our upcoming promotional video. Check if scenes transition logically, the narrative keeps viewers hooked, and the on-screen text complements the voiceover. Provide notes for improvement, ensuring that the final product feels cohesive, visually appealing, and aligned with our brand’s intended messaging trajectory.",
    ColorId = 1,
    Position = 5
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Review Keyword Implementation",
    ListId = list7Id,
    Description = "Inspect the keyword integration across various content pieces. Confirm that chosen phrases appear naturally and support the main narrative without feeling forced. Suggest enhancements where necessary, maintaining a balance between SEO best practices and reader experience. This ensures we maintain authenticity while still optimizing for search visibility.",
    ColorId = null,
    Position = 6
},

        // PRE-LAUNCH (list8)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Set Up Analytics", ListId = list8Id,
            Description = "Implement tracking pixels, configure Google Analytics, and integrate conversion goals. Confirm that each funnel step is measurable, and test data accuracy with sample visits. Proper analytics setup ensures data-driven insights post-launch, informing future campaign adjustments and demonstrating measurable return on marketing investments.",
            ColorId = 1, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Team Meeting Final Approvals", ListId = list8Id,
            Description = "Schedule a final team meeting to review all campaign elements, from content and design to messaging and outreach plans. Confirm that stakeholders are aligned on launch timing, KPIs, and expectations. Resolve any lingering concerns and ensure all team members leave with clear next steps.",
            ColorId = null, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Final Outreach Email Test", ListId = list8Id,
            Description = "Send a test version of the outreach email to internal team members, verifying formatting, link accuracy, and responsiveness. Check that subject lines are compelling and preheaders support the open. Once all issues are addressed, the email is ready for distribution, setting the stage for a strong campaign debut.",
            ColorId = 1, Position = 3
        },
        new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Final Social Platform Checks",
    ListId = list8Id,
    Description = "Perform a last-minute audit on all scheduled social posts. Confirm that captions, hashtags, and links are accurate and that images render correctly. This quality control step guarantees that, when we hit ‘publish,’ our presence feels polished and prepared, reducing risks of misinformation or broken user experiences.",
    ColorId = 1,
    Position = 4
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Influencer Outreach Confirmations",
    ListId = list8Id,
    Description = "Send follow-up messages to influencers we plan to collaborate with during the launch. Verify that they understand their deliverables, timelines, and branding guidelines. By securing their confirmation now, we ensure smooth execution on launch day, maximizing reach and engagement through trusted voices connected to our target audience.",
    ColorId = null,
    Position = 5
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Check Landing Page Load Speeds",
    ListId = list8Id,
    Description = "Test the landing page’s loading performance on different devices and network conditions. Identify any slow-loading elements, oversized images, or script issues that could deter visitors. Provide recommendations for optimization so that our audience experiences a seamless, responsive page, improving conversion rates and overall user satisfaction upon launch.",
    ColorId = 1,
    Position = 6
},
new Ticket {
    Id = Guid.NewGuid().ToString(),
    Name = "Legal & Compliance Verification",
    ListId = list8Id,
    Description = "Review disclaimers, privacy policy links, and terms of service references across all campaign materials. Confirm that our messaging and data collection practices meet legal and regulatory standards. By ensuring compliance beforehand, we protect the brand’s integrity and maintain the trust of our audience from day one.",
    ColorId = null,
    Position = 7
},

        // COMPLETED (list9)
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Launch Survey", ListId = list9Id,
            Description = "Deploy the planned survey to our subscriber list, capturing feedback on brand perception, product interest, and campaign messaging effectiveness. This survey provides valuable qualitative and quantitative data to refine strategies and guide future initiatives. The successful completion marks a key milestone in the campaign’s lifecycle.",
            ColorId = 4, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Pre-Launch Social Teaser", ListId = list9Id,
            Description = "Previously posted teaser content introduced our upcoming campaign, building anticipation and fostering curiosity. The post achieved high engagement, with audience members sharing, commenting, and expressing interest. With this milestone complete, we have a solid foundation of brand awareness and excitement fueling the campaign’s official kickoff.",
            ColorId = 2, Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Archived Past Campaign Assets", ListId = list9Id,
            Description = "Organize and archive creative files, documents, and analytics reports from previous marketing efforts. This historical repository will serve as a reference, enabling the team to learn from past wins and missteps. Completing this archiving process ensures we maintain a well-structured knowledge base to inform future strategic decisions.",
            ColorId = 3, Position = 3
        }
    };

    context.Boards.Add(board);
    context.Lists.AddRange(lists);
    context.Tickets.AddRange(tickets);
    await context.SaveChangesAsync();

    return boardId;
}

public static async Task<string> SeedCommunityFairBoardAsync(ApplicationDbContext context, string userId)
{
    string boardId = Guid.NewGuid().ToString();

    // 6 Lists representing different planning stages for a community fair
    string list1Id = Guid.NewGuid().ToString(); // Ideas & Brainstorm (4 tickets)
    string list2Id = Guid.NewGuid().ToString(); // Outreach & Vendor Coordination (9 tickets)
    string list3Id = Guid.NewGuid().ToString(); // Logistics & Setup (2 tickets)
    string list4Id = Guid.NewGuid().ToString(); // Promotion & Advertising (6 tickets)
    string list5Id = Guid.NewGuid().ToString(); // Day-Of Operations (3 tickets)
    string list6Id = Guid.NewGuid().ToString(); // Post-Event Review & Follow-Up (10 tickets)

    var board = new Board
    {
        Id = boardId,
        Name = "Community Fair Planning",
        ColorId = 3,
        UserId = userId,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
    };

    var lists = new[]
    {
        new List { Id = list1Id, Name = "Ideas & Brainstorm", BoardId = boardId, Position = 1 },
        new List { Id = list2Id, Name = "Outreach & Vendor Coordination", BoardId = boardId, Position = 2 },
        new List { Id = list3Id, Name = "Logistics & Setup", BoardId = boardId, Position = 3 },
        new List { Id = list4Id, Name = "Promotion & Advertising", BoardId = boardId, Position = 4 },
        new List { Id = list5Id, Name = "Day-Of Operations", BoardId = boardId, Position = 5 },
        new List { Id = list6Id, Name = "Post-Event Review & Follow-Up", BoardId = boardId, Position = 6 }
    };

    var tickets = new[]
    {
        // LIST 1: IDEAS & BRAINSTORM (4 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Initial Theme Discussion",
            ListId = list1Id,
            Description = "Convene a small working group to brainstorm overarching themes that reflect the community’s identity and seasonal charm. Encourage free-flowing discussion, inviting everyone to propose bold, creative concepts. Consider aspects like cultural traditions, local history, or sustainability-focused messaging.",
            ColorId = null,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Activity Wishlist",
            ListId = list1Id,
            Description = "Compile an extensive list of potential attractions, games, and interactive experiences suitable for all ages. Include options like live music, storytelling tents, nature-inspired crafts, educational exhibits, and family-friendly competitions. Consider engaging workshops, from simple culinary demonstrations to intro-level art classes.",
            ColorId = 1,
            Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Venue Possibilities",
            ListId = list1Id,
            Description = "Research various potential venues, including public parks, school fields, and community center lawns. Evaluate each location for accessibility, restroom facilities, parking options, and natural shade. Look at the surrounding environment and determine if it can safely and comfortably accommodate expected crowds.",
            ColorId = null,
            Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Eco-Friendly Ideas",
            ListId = list1Id,
            Description = "Develop a list of environmentally conscious initiatives that reduce waste and support local ecosystems. Consider composting stations, sturdy reusable tableware rentals, and on-site educational posters highlighting regional plants and wildlife. Explore partnerships with green nonprofits to offer eco-themed workshops and engage visitors in sustainable living practices.",
            ColorId = 1,
            Position = 4
        },

        // LIST 2: OUTREACH & VENDOR COORDINATION (9 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Contact Local Artisans",
            ListId = list2Id,
            Description = "Reach out to a diverse array of skilled craftspeople, from potters and weavers to metalworkers and jewelers. Introduce the fair’s theme and projected attendance figures, ensuring artisans feel confident about potential foot traffic. Discuss booth rental details, promotional opportunities, and special offers for early sign-ups.",
            ColorId = 2,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Invite Food Trucks",
            ListId = list2Id,
            Description = "Curate a lineup of food trucks offering dishes that reflect the community’s cultural tapestry and evolving culinary trends. Include options for vegetarians, vegans, and those with dietary restrictions, ensuring broad appeal. Contact popular operators well in advance, explaining the expected crowd size, brand exposure, and potential revenue.",
            ColorId = 3,
            Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Non-Profit Booth Invitations",
            ListId = list2Id,
            Description = "Identify local nonprofits focused on community welfare, environmental advocacy, or educational initiatives. Offer them complimentary booth space to share their mission, recruit volunteers, and build public awareness. Provide guidance on display strategies, ensuring that each organization’s message aligns with the fair’s inclusive and uplifting atmosphere.",
            ColorId = 2,
            Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Cultural Performance Acts",
            ListId = list2Id,
            Description = "Reach out to performers who can showcase the community’s rich cultural heritage. Consider traditional dance troupes, storytelling sessions celebrating local folklore, and musical ensembles representing different backgrounds. Discuss scheduling, technical requirements, and promotional support for each act.",
            ColorId = 3,
            Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Children’s Activity Providers",
            ListId = list2Id,
            Description = "Invite professionals who specialize in child-centric entertainment, such as face painters, balloon sculptors, puppet masters, or nature guides. Offer them prime locations near family seating areas and simple, safe setups. Highlight the fair’s family-oriented atmosphere and potential for steady foot traffic throughout the day.",
            ColorId = 2,
            Position = 5
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Local Farm & Produce Stalls",
            ListId = list2Id,
            Description = "Approach nearby farmers and growers to host produce stands featuring seasonal fruits, vegetables, honey, and artisanal preserves. Emphasize the event’s celebration of local resources, healthy eating, and sustainable agriculture. Encourage them to offer taste tests, cooking tips, or recipe cards to educate attendees.",
            ColorId = 3,
            Position = 6
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Fitness & Wellness Partners",
            ListId = list2Id,
            Description = "Contact yoga instructors, fitness trainers, or wellness coaches who can run mini-sessions or demonstrations. Whether it’s a short stretching class, a guided meditation, or basic strength exercises, these activities inspire healthier lifestyles. Stress the benefits of connecting with a receptive audience and building brand recognition.",
            ColorId = 2,
            Position = 7
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Animal Rescue & Pet Adoption Info",
            ListId = list2Id,
            Description = "Invite a local animal shelter or rescue group to host an informational booth. They can display photos of adoptable pets, provide details on fostering, and educate visitors about responsible pet ownership. Encourage them to share uplifting success stories and highlight volunteer opportunities.",
            ColorId = 3,
            Position = 8
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Sponsor Partnership Inquiries",
            ListId = list2Id,
            Description = "Reach out to regional businesses, banks, and service providers for potential sponsorships. Offer tiers with varying benefits, such as prominent signage, brand mentions in promotional materials, or dedicated vendor spots. Emphasize the fair’s community reach and goodwill, ensuring sponsors see tangible returns on their investment.",
            ColorId = 2,
            Position = 9
        },

        // LIST 3: LOGISTICS & SETUP (2 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Layout & Booth Assignments",
            ListId = list3Id,
            Description = "Develop a comprehensive site map detailing where vendors, activity areas, performance stages, and seating zones will be located. Consider crowd flow, emergency exits, and accessibility requirements. Assign booths strategically, mixing diverse vendors to maintain visitor interest throughout the fairgrounds.",
            ColorId = 4,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Utility & Restroom Facilities",
            ListId = list3Id,
            Description = "Coordinate portable toilets, handwashing stations, and ample waste and recycling bins. Check local regulations for placement and maintenance, ensuring convenience for attendees. Arrange for backup generators, adequate lighting, and, if needed, water supply points. Confirm that vendors have reliable access to electricity if required.",
            ColorId = 5,
            Position = 2
        },

        // LIST 4: PROMOTION & ADVERTISING (6 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Social Media Countdown",
            ListId = list4Id,
            Description = "Create a posting schedule counting down to the fair’s opening day. Each post can highlight a new vendor, performer, or family activity, building anticipation and encouraging followers to mark their calendars. Use vibrant visuals, engaging captions, and relevant hashtags.",
            ColorId = 3,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Local Radio Announcement",
            ListId = list4Id,
            Description = "Draft a concise yet informative script highlighting the fair’s theme, star attractions, and inclusivity. Contact a well-known local radio host to read the announcement several times during peak listenership hours. Emphasize family appeal, community spirit, and unique offerings that listeners won’t want to miss.",
            ColorId = 5,
            Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Flyer Distribution at Schools",
            ListId = list4Id,
            Description = "Design colorful, eye-catching flyers with clear event details, attractive visuals, and a simple map. Seek permission from school administrators to place flyers in common areas or send them home with students. Emphasize family-friendly activities that parents and children can enjoy together.",
            ColorId = 3,
            Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Feature in Local Newsletter",
            ListId = list4Id,
            Description = "Write a short, engaging article for a community newsletter or bulletin. Include a brief history of the fair’s inspiration, highlights of expected attractions, and a call-to-action inviting readers to attend. Provide relevant dates, times, and ticketing information if applicable.",
            ColorId = 5,
            Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Hashtag Creation & Contest",
            ListId = list4Id,
            Description = "Develop a unique, memorable hashtag that captures the fair’s spirit. Announce a photo contest encouraging attendees to post pictures under this hashtag. Offer a small prize, like a gift card or special merchandise, to the best submission. User-generated content can spread organically as people share their experiences online.",
            ColorId = 3,
            Position = 5
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Influencer Outreach",
            ListId = list4Id,
            Description = "Identify local influencers known for highlighting community events, family activities, or unique cultural experiences. Invite them to attend and share candid impressions on their platforms. Offer backstage peeks, interviews with vendors, or exclusive previews of performances.",
            ColorId = 5,
            Position = 6
        },

        // LIST 5: DAY-OF OPERATIONS (3 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Volunteer Briefing",
            ListId = list5Id,
            Description = "Gather all volunteers before gates open to deliver a concise orientation. Outline roles, from assisting vendors and directing guests to maintaining cleanliness and answering questions. Encourage volunteers to be proactive, friendly, and adaptable. Provide guidelines on handling lost children, addressing minor complaints, or contacting organizers for urgent matters.",
            ColorId = 2,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Performance Schedule Monitoring",
            ListId = list5Id,
            Description = "Assign a dedicated staff member to oversee the performance timeline. They will confirm each act’s arrival, handle last-minute adjustments, and ensure smooth transitions between stages. Regularly update signage or digital displays if changes occur. By maintaining punctuality, we reduce idle time, keeping attendees engaged throughout the day.",
            ColorId = 4,
            Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Real-Time Social Updates",
            ListId = list5Id,
            Description = "Empower a social media volunteer to roam the fair, capturing spontaneous moments: a child’s laughter near a puppet show, a delighted vendor after a big sale, a group of neighbors savoring local treats. Post these snapshots and short video clips with brief captions, inviting followers to join in on the fun.",
            ColorId = 3,
            Position = 3
        },

        // LIST 6: POST-EVENT REVIEW & FOLLOW-UP (10 tickets)
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Attendee Feedback Survey",
            ListId = list6Id,
            Description = "Shortly after the fair, email a simple survey to attendees who signed up for notifications or purchased tickets online. Ask about their favorite attractions, any issues faced, and suggestions for improvement. Keep it user-friendly and mobile-accessible.",
            ColorId = 1,
            Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Vendor Appreciation Emails",
            ListId = list6Id,
            Description = "Send personalized, appreciative messages to each participating vendor, thanking them for their contributions. Mention estimated foot traffic, highlight positive feedback from visitors, and invite them to share suggestions for next year. Consider including photos of their booths in action.",
            ColorId = null,
            Position = 2
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Performance Acts Feedback",
            ListId = list6Id,
            Description = "Reach out to all performers for their honest impressions. Inquire whether sound systems, staging conditions, and audience engagement met their expectations. Ask if they have suggestions for scheduling improvements or stage layout adjustments. Constructive feedback empowers us to enhance the performer experience.",
            ColorId = 1,
            Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Budget Reconciliation",
            ListId = list6Id,
            Description = "Review all financial transactions, including sponsorship contributions, vendor fees, and event-related expenses like marketing, rentals, and utilities. Confirm that income and costs align with initial projections. Identify areas of overspending or unexpected savings, noting these for future reference.",
            ColorId = null,
            Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Social Media Engagement Analysis",
            ListId = list6Id,
            Description = "Examine social platform metrics collected before, during, and after the event. Track hashtag usage, post likes, comments, shares, and follower growth. Identify which content types resonated most—vendor spotlights, live videos, or family selfies. Data-driven insights can guide future promotional tactics, focusing messages that deliver the strongest response.",
            ColorId = 1,
            Position = 5
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Photo & Video Archiving",
            ListId = list6Id,
            Description = "Organize all visual media gathered from staff photographers, volunteer submissions, and social posts. Categorize images by vendors, performances, activities, and crowd interactions. This curated library serves as a valuable resource for future marketing campaigns, press releases, and promotional materials.",
            ColorId = null,
            Position = 6
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Lessons Learned Document",
            ListId = list6Id,
            Description = "Compile a comprehensive report summarizing successes, challenges, and unexpected insights from all aspects of the fair. Include input from staff, volunteers, vendors, and attendees. Identify what elements ran smoothly, what logistics need refinement, and which attractions drew the most interest.",
            ColorId = 1,
            Position = 7
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Highlight Reel Creation",
            ListId = list6Id,
            Description = "Select the most visually striking and emotionally resonant moments captured on video. Edit a short highlight reel that tells the story of the event: smiling families, dynamic performances, engaging vendors, and cozy communal gatherings. Add upbeat background music, brief captions, or voiceovers for context.",
            ColorId = null,
            Position = 8
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Sponsor Follow-Up Meetings",
            ListId = list6Id,
            Description = "Arrange brief follow-up calls or coffee sessions with sponsors to review outcomes and discuss their impressions. Present engagement metrics, highlight any direct mentions or signage visibility, and gather suggestions for increasing sponsorship value next year.",
            ColorId = 1,
            Position = 9
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(),
            Name = "Next Year’s Early Brainstorm",
            ListId = list6Id,
            Description = "Document emerging ideas for upcoming fairs, capturing new themes, proposed collaborations, and innovative attractions. Reflect on which vendor categories or activities merited expansion, which promotions delivered meaningful engagement, and what logistical adjustments could simplify operations.",
            ColorId = null,
            Position = 10
        }
    };

    context.Boards.Add(board);
    context.Lists.AddRange(lists);
    context.Tickets.AddRange(tickets);
    await context.SaveChangesAsync();

    return boardId;
}

public static async Task<string> SeedWeeklyChoresBoardAsync(ApplicationDbContext context, string userId)
{
    string boardId = Guid.NewGuid().ToString();

    // 9 lists: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, Done, Backlog
    string mondayId = Guid.NewGuid().ToString();
    string tuesdayId = Guid.NewGuid().ToString();
    string wednesdayId = Guid.NewGuid().ToString();
    string thursdayId = Guid.NewGuid().ToString();
    string fridayId = Guid.NewGuid().ToString();
    string saturdayId = Guid.NewGuid().ToString();
    string sundayId = Guid.NewGuid().ToString();
    string doneId = Guid.NewGuid().ToString();
    string backlogId = Guid.NewGuid().ToString();

    var board = new Board
    {
        Id = boardId,
        Name = "Weekly Chores",
        ColorId = 5,
        UserId = userId,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    var lists = new[]
    {
        new List { Id = mondayId, Name = "Monday - DONE!", BoardId = boardId, Position = 1 },
        new List { Id = tuesdayId, Name = "Tuesday", BoardId = boardId, Position = 2 },
        new List { Id = wednesdayId, Name = "Wednesday", BoardId = boardId, Position = 3 },
        new List { Id = thursdayId, Name = "Thursday", BoardId = boardId, Position = 4 },
        new List { Id = fridayId, Name = "Friday", BoardId = boardId, Position = 5 },
        new List { Id = saturdayId, Name = "Saturday", BoardId = boardId, Position = 6 },
        new List { Id = sundayId, Name = "Sunday", BoardId = boardId, Position = 7 },
        new List { Id = doneId, Name = "Completed chores", BoardId = boardId, Position = 8 },
        new List { Id = backlogId, Name = "Backlog", BoardId = boardId, Position = 9 }
    };

    // Color coding suggestion:
    // 1 = Food-related (e.g. grocery shopping)
    // 2 = Pet-related (dog walking, feeding)
    // 3 = Cleaning (vacuuming, dusting)
    // 4 = Errands (post office, returns)
    // 5 = Laundry/Clothing
    // 6 = Maintenance tasks

    var tickets = new[]
    {
      // Monday (empty)
      // No tickets for Monday

      // Tuesday (5 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Grocery Shopping",
        ListId = tuesdayId,
        Description = "Buy fresh vegetables, fruits, and dairy for the week. Check discounts on produce and ensure quality. Keep the list handy to avoid impulse buys and stay within the planned budget.",
        ColorId = 1,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Walk the Dog",
        ListId = tuesdayId,
        Description = "Take the dog for a brisk walk around the neighborhood. Let it explore safely, sniff around, and stretch its legs. Aim for a thirty-minute stroll that keeps the pet energized.",
        ColorId = 2,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Vacuum Living Room",
        ListId = tuesdayId,
        Description = "Use the vacuum to remove dust and small debris from carpets and sofas. Move light furniture if needed. Focus on corners and under tables to maintain a clean environment.",
        ColorId = 3,
        Position = 3
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Mail Package",
        ListId = tuesdayId,
        Description = "Visit the post office and send a small parcel to a friend. Confirm proper postage, address details, and ensure fragile items are well-protected. Keep the receipt for tracking purposes.",
        ColorId = 4,
        Position = 4
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Wash Towels",
        ListId = tuesdayId,
        Description = "Gather used towels from the bathroom and kitchen. Wash them on a warm cycle with gentle detergent. Dry them thoroughly so they remain soft, fresh-smelling, and ready for reuse.",
        ColorId = 5,
        Position = 5
      },

      // Wednesday (3 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Feed the Cat",
        ListId = wednesdayId,
        Description = "Refill the cat’s bowl with dry food and refresh its water. Check for any spills and clean around the feeding area. Keep feeding schedule consistent to maintain proper nutrition.",
        ColorId = 2,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Dust Bookshelves",
        ListId = wednesdayId,
        Description = "Gently wipe shelves with a microfiber cloth. Remove books temporarily to clean underneath. Return them neatly, keeping titles organized. Regular dusting preserves book quality and ensures a tidy display.",
        ColorId = 3,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Repair Drawer Handle",
        ListId = wednesdayId,
        Description = "Tighten loose screws on the kitchen drawer handle. Use a screwdriver and ensure everything fits snugly. A stable handle makes daily tasks smoother and prevents future wear or damage.",
        ColorId = 6,
        Position = 3
      },

      // Thursday (6 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Pick Up Dry Cleaning",
        ListId = thursdayId,
        Description = "Collect professionally cleaned garments from the local dry cleaner. Inspect items to confirm no damage or missed spots. Store clothes properly to keep them fresh and wrinkle-free.",
        ColorId = 5,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Refill Dog Treats",
        ListId = thursdayId,
        Description = "Buy a new pack of healthy dog treats from the pet store. Ensure ingredients are natural and beneficial. Rewarding good behavior helps maintain a happy, well-trained companion.",
        ColorId = 2,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Organize Kitchen Drawer",
        ListId = thursdayId,
        Description = "Sort utensils and gadgets. Discard broken items, place frequently used tools upfront, and ensure everything is easily accessible. A neat drawer saves time and reduces kitchen clutter.",
        ColorId = 3,
        Position = 3
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Buy Bread and Eggs",
        ListId = thursdayId,
        Description = "Stop by the bakery and pick up fresh bread and eggs. Check expiration dates and select items that look appealing and fit meal plans for the upcoming days.",
        ColorId = 1,
        Position = 4
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Drop Off Recyclables",
        ListId = thursdayId,
        Description = "Take collected paper, plastic, and glass to the nearest recycling bin. Ensure materials are clean and properly sorted. Regular recycling reduces waste and supports environmental responsibility.",
        ColorId = 4,
        Position = 5
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Clean Shower Tile",
        ListId = thursdayId,
        Description = "Use a mild cleaning solution and scrub brush to remove soap scum and mildew. Rinse thoroughly and dry surfaces. A clean shower area promotes hygiene and daily comfort.",
        ColorId = 3,
        Position = 6
      },

      // Friday (4 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Walk Dog in Park",
        ListId = fridayId,
        Description = "Take the dog for a walk in the local park. Let it enjoy green spaces, fresh air, and safe socialization with other pets. A fun outing boosts its mood.",
        ColorId = 2,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Bank Deposit",
        ListId = fridayId,
        Description = "Visit the bank and deposit checks. Confirm amounts, request a receipt, and ensure account balances update correctly. Completing financial errands on time avoids unnecessary stress.",
        ColorId = 4,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Wipe Kitchen Counters",
        ListId = fridayId,
        Description = "Clean countertops using a damp cloth and mild spray. Remove crumbs and sticky spots. Keeping surfaces pristine encourages healthy meal preparation and deters unwanted pests.",
        ColorId = 3,
        Position = 3
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Wash Pillowcases",
        ListId = fridayId,
        Description = "Launder pillowcases on a gentle cycle with hypoallergenic detergent. Dry them thoroughly to maintain softness. Fresh linens improve sleep quality and prolong fabric lifespan.",
        ColorId = 5,
        Position = 4
      },

      // Saturday (3 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Check Mailbox",
        ListId = saturdayId,
        Description = "Retrieve letters, flyers, and packages. Sort them immediately, discarding junk mail and organizing important documents. Regular checks prevent missed deadlines and forgotten correspondence.",
        ColorId = 4,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Refill Bird Feeder",
        ListId = saturdayId,
        Description = "Add fresh birdseed to the outdoor feeder. Clean off old residue and ensure it’s placed securely. Supporting local wildlife brings pleasant melodies and natural balance.",
        ColorId = 2,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Spot-Clean Entry Rug",
        ListId = saturdayId,
        Description = "Use a stain remover and soft cloth to address spills or footprints at the entrance. A tidy entryway creates a welcoming atmosphere and prolongs rug life.",
        ColorId = 3,
        Position = 3
      },

      // Sunday (5 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Buy Fruits",
        ListId = sundayId,
        Description = "Pick up assorted fruits like apples, bananas, and berries. Choose ripe, fresh produce that complements upcoming breakfasts and snacks. Good fruits maintain energy throughout busy weeks.",
        ColorId = 1,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Replace Light Bulb",
        ListId = sundayId,
        Description = "Change the burned-out bulb in the hallway. Use a proper wattage replacement and ensure the fixture is switched off for safety. Bright lighting improves overall home ambiance.",
        ColorId = 6,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Brush Dog",
        ListId = sundayId,
        Description = "Gently groom the dog’s fur with a soft brush, removing loose hair and tangles. Offering treats afterward reinforces calm behavior and keeps the pet’s coat healthy.",
        ColorId = 2,
        Position = 3
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Rinse Coffee Maker",
        ListId = sundayId,
        Description = "Run hot water through the coffee machine without grounds. Wipe the exterior and ensure filters are clean. A fresh coffee maker guarantees better-tasting morning brews.",
        ColorId = 3,
        Position = 4
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Fold Laundry",
        ListId = sundayId,
        Description = "Neatly fold dried clothes, grouping similar items together. Store them properly in drawers or closets. Organized clothing makes dressing easier and feels more put-together daily.",
        ColorId = 5,
        Position = 5
      },

      // Done (3 tickets)
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Fix Kitchen Faucet",
        ListId = doneId,
        Description = "Earlier this morning, tightened the faucet’s loose part using a wrench. Water now flows smoothly without leaks. Prompt maintenance spared future hassle and expense.",
        ColorId = 6,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Wipe Windows",
        ListId = doneId,
        Description = "Cleaned window glass yesterday, removing smudges and fingerprints. Clear windows let in more natural light, improving ambiance. Crisp views uplift everyone’s mood at home.",
        ColorId = 3,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Refill Pet Water Bowl",
        ListId = doneId,
        Description = "Refreshed the pet’s water supply last night. Ensured bowl was clean, providing the animal with safe, cool hydration. Routine care keeps beloved companions healthy.",
        ColorId = 2,
        Position = 3
      },

      // Backlog (5 tickets) - Some were meant for Monday but not done
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Buy Milk and Cheese",
        ListId = backlogId,
        Description = "Originally planned for Monday, this grocery errand got postponed. Need fresh dairy for upcoming meals. Ensure quality products and proper storage to maintain taste.",
        ColorId = 1,
        Position = 1
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Walk Neighbor’s Dog",
        ListId = backlogId,
        Description = "Offered to help a neighbor, but didn’t manage on Monday. Provide a short, comfortable walk around the block. Builds trust and maintains friendly relations.",
        ColorId = 2,
        Position = 2
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Mop Kitchen Floor",
        ListId = backlogId,
        Description = "A task left undone from Monday’s schedule. Quickly mop to remove spills and stains, improving kitchen cleanliness and reducing slip hazards.",
        ColorId = 3,
        Position = 3
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Return Library Books",
        ListId = backlogId,
        Description = "Monday’s intended errand. Take overdue books back to the library. Avoid late fees and free up borrowing space for new reading material.",
        ColorId = 4,
        Position = 4
      },
      new Ticket
      {
        Id = Guid.NewGuid().ToString(),
        Name = "Wash Workout Gear",
        ListId = backlogId,
        Description = "Didn’t complete on Monday. Launder gym clothes to remove sweat and odors. Fresh workout gear encourages consistent exercise habits.",
        ColorId = 5,
        Position = 5
      },
    };

    context.Boards.Add(board);
    context.Lists.AddRange(lists);
    context.Tickets.AddRange(tickets);
    await context.SaveChangesAsync();

    return boardId;
}

}
