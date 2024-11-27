﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using backend.Data;

#nullable disable

namespace backend.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20241126235548_IncreaseMaxLengthForTicketDescription")]
    partial class IncreaseMaxLengthForTicketDescription
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.8")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("YourProject.Models.Board", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("ColorId")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedAt")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("ColorId");

                    b.HasIndex("UserId");

                    b.ToTable("Boards");

                    b.HasData(
                        new
                        {
                            Id = "test-id-123",
                            ColorId = 1,
                            CreatedAt = new DateTime(2024, 11, 26, 23, 55, 48, 500, DateTimeKind.Utc).AddTicks(8237),
                            Name = "test marketing board",
                            UpdatedAt = new DateTime(2024, 11, 26, 23, 55, 48, 500, DateTimeKind.Utc).AddTicks(8240),
                            UserId = "google-oauth2|116927637409288985519"
                        });
                });

            modelBuilder.Entity("YourProject.Models.Color", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("HexCode")
                        .IsRequired()
                        .HasMaxLength(7)
                        .HasColumnType("varchar(7)");

                    b.HasKey("Id");

                    b.ToTable("Colors");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            HexCode = "#50C996"
                        },
                        new
                        {
                            Id = 2,
                            HexCode = "#3BBA3B"
                        },
                        new
                        {
                            Id = 3,
                            HexCode = "#8131F9"
                        },
                        new
                        {
                            Id = 4,
                            HexCode = "#FEA362"
                        },
                        new
                        {
                            Id = 5,
                            HexCode = "#F773BE"
                        },
                        new
                        {
                            Id = 6,
                            HexCode = "#EE4646"
                        });
                });

            modelBuilder.Entity("YourProject.Models.List", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("BoardId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("Position")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("BoardId");

                    b.ToTable("Lists");

                    b.HasData(
                        new
                        {
                            Id = "list-1",
                            BoardId = "test-id-123",
                            Name = "To Do",
                            Position = 1
                        },
                        new
                        {
                            Id = "list-2",
                            BoardId = "test-id-123",
                            Name = "In Progress",
                            Position = 2
                        },
                        new
                        {
                            Id = "list-3",
                            BoardId = "test-id-123",
                            Name = "Review",
                            Position = 3
                        },
                        new
                        {
                            Id = "list-4",
                            BoardId = "test-id-123",
                            Name = "Completed",
                            Position = 4
                        });
                });

            modelBuilder.Entity("YourProject.Models.Ticket", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("ColorId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(10000)
                        .HasColumnType("varchar(10000)");

                    b.Property<string>("ListId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<int>("Position")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("ColorId");

                    b.HasIndex("ListId");

                    b.ToTable("Tickets");

                    b.HasData(
                        new
                        {
                            Id = "ticket-1",
                            ColorId = 2,
                            Description = "Outline key strategies.",
                            ListId = "list-1",
                            Name = "Create Marketing Plan",
                            Position = 1
                        },
                        new
                        {
                            Id = "ticket-2",
                            ColorId = 3,
                            Description = "Gather competitive insights.",
                            ListId = "list-1",
                            Name = "Research Competitors",
                            Position = 2
                        },
                        new
                        {
                            Id = "ticket-3",
                            ColorId = 4,
                            Description = "Draft posts for Q1.",
                            ListId = "list-2",
                            Name = "Social Media Campaign",
                            Position = 1
                        },
                        new
                        {
                            Id = "ticket-4",
                            ColorId = 5,
                            Description = "Initial design concept.",
                            ListId = "list-2",
                            Name = "Design Landing Page",
                            Position = 2
                        },
                        new
                        {
                            Id = "ticket-5",
                            ColorId = 6,
                            Description = "SEO-focused articles.",
                            ListId = "list-2",
                            Name = "Write Blog Posts",
                            Position = 3
                        },
                        new
                        {
                            Id = "ticket-6",
                            ColorId = 2,
                            Description = "Get approval from finance.",
                            ListId = "list-3",
                            Name = "Budget Approval",
                            Position = 1
                        },
                        new
                        {
                            Id = "ticket-7",
                            ColorId = 4,
                            Description = "Prepare Q1 newsletter.",
                            ListId = "list-3",
                            Name = "Draft Newsletter",
                            Position = 2
                        },
                        new
                        {
                            Id = "ticket-8",
                            ColorId = 1,
                            Description = "Google Analytics setup.",
                            ListId = "list-4",
                            Name = "Set Up Analytics",
                            Position = 1
                        },
                        new
                        {
                            Id = "ticket-9",
                            ColorId = 2,
                            Description = "Discuss goals and milestones.",
                            ListId = "list-4",
                            Name = "Team Meeting",
                            Position = 2
                        },
                        new
                        {
                            Id = "ticket-10",
                            ColorId = 4,
                            Description = "Send out to subscribers.",
                            ListId = "list-4",
                            Name = "Launch Survey",
                            Position = 3
                        });
                });

            modelBuilder.Entity("YourProject.Models.User", b =>
                {
                    b.Property<string>("Id")
                        .HasMaxLength(255)
                        .HasColumnType("varchar(255)");

                    b.Property<bool>("IsGuest")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserName")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = "google-oauth2|116927637409288985519",
                            IsGuest = false,
                            UserName = "User"
                        });
                });

            modelBuilder.Entity("YourProject.Models.Board", b =>
                {
                    b.HasOne("YourProject.Models.Color", "Color")
                        .WithMany("Boards")
                        .HasForeignKey("ColorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("YourProject.Models.User", "User")
                        .WithMany("Boards")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Color");

                    b.Navigation("User");
                });

            modelBuilder.Entity("YourProject.Models.List", b =>
                {
                    b.HasOne("YourProject.Models.Board", "Board")
                        .WithMany("Lists")
                        .HasForeignKey("BoardId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Board");
                });

            modelBuilder.Entity("YourProject.Models.Ticket", b =>
                {
                    b.HasOne("YourProject.Models.Color", "Color")
                        .WithMany("Tickets")
                        .HasForeignKey("ColorId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("YourProject.Models.List", "List")
                        .WithMany("Tickets")
                        .HasForeignKey("ListId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Color");

                    b.Navigation("List");
                });

            modelBuilder.Entity("YourProject.Models.Board", b =>
                {
                    b.Navigation("Lists");
                });

            modelBuilder.Entity("YourProject.Models.Color", b =>
                {
                    b.Navigation("Boards");

                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("YourProject.Models.List", b =>
                {
                    b.Navigation("Tickets");
                });

            modelBuilder.Entity("YourProject.Models.User", b =>
                {
                    b.Navigation("Boards");
                });
#pragma warning restore 612, 618
        }
    }
}