using backend.Data;
using YourProject.Models;


public static class BoardSeeder
{
  
public static async Task<string> SeedGuestBoardAsync(ApplicationDbContext context, string userId)
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
        Name = "Marketing Campaign Planning (Example)",
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
            Description = "Examine our top three competitors, assessing their brand voice, content strategy, and campaign performance. Identify unique selling points and subtle differentiators that we can emphasize. Summarize findings in a concise report, highlighting opportunities to position our brand more effectively. This analysis will serve as a compass, guiding subsequent decisions on messaging, offers, and overall positioning.",
            ColorId = null, Position = 3
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Creative Concept Ideation", ListId = list1Id,
            Description = "Host a creative workshop where the team pitches new campaign concepts, including tagline ideas, storytelling angles, and interactive elements. Encourage diverse input, from humorous social media hooks to data-driven infographics. Narrow down concepts to a shortlist that aligns with our brand’s voice, values, and overarching goals. Document these ideas for later refinement.",
            ColorId = 1, Position = 4
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Preliminary Influencer Identification", ListId = list1Id,
            Description = "Research industry thought leaders, niche bloggers, and social media influencers whose audiences match our target demographics. Compile a preliminary list of potential partners, noting their follower counts, engagement rates, and content themes. This initial roster will guide future influencer outreach, collaborations, and content co-creation opportunities that can boost brand visibility.",
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
            Description = "Draft a comprehensive marketing plan outlining campaign objectives, target audience segments, channel strategies, and key performance indicators. Break down each initiative into actionable steps with clear responsibilities and timelines. This plan will serve as a strategic roadmap, ensuring that the entire team remains aligned, focused, and prepared to execute effectively.",
            ColorId = 6, Position = 1
        },
        new Ticket {
            Id = Guid.NewGuid().ToString(), Name = "Budget Allocation & Approval", ListId = list2Id,
            Description = "Develop a detailed budget that allocates resources to paid ads, influencer partnerships, content creation, design services, and analytics tools. Present this budget to finance and leadership for approval. Provide justifications for each expense, ensuring stakeholder confidence that investments will yield measurable returns and support the campaign’s overall objectives.",
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
            Description = "Craft a monthly newsletter outlining upcoming promotions, newly published content, and behind-the-scenes campaign highlights. Aim to engage subscribers with a friendly, conversational tone and compelling visuals. Highlight key achievements, invite feedback, and maintain a sense of exclusivity, encouraging recipients to remain loyal and share our updates with peers.",
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

}
