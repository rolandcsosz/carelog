--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Debian 14.17-1.pgdg120+1)
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.admins (id, name, email, password) FROM stdin;
2	Kiss József	kiss.jozsef@admin.hu	$2b$10$y21AkjY.559lovknOBWSkuMTbatchsXq6FmsUlwJP.z2mWY2dELry
3	Nagy Anna	nagy.anna@admin.hu	$2b$10$NUO4PKaqkS69Hngrd0/sG.0H2yaFRNzkFEL4t5b1pAQJ.1KpRmYb6
4	Tóth László	toth.laszlo@admin.hu	$2b$10$GVjWog2c68MnJaCJP4hBpu2dlGN/dbuvx8M4q5XHYrpfUy6qFJzUC
5	Szabó Katalin	szabo.katalin@admin.hu	$2b$10$j3hlYLvAUN2MApdWkF3rXOKMsAH21/pM9GWGMJeHJT2RtK9TXiNqG
6	Farkas Gábor	farkas.gabor@admin.hu	$2b$10$bw9PqdytR0NQrf/uf9ZDj.MUl2quubtZo8pbUTWdwWdIanUoG6XyW
\.


--
-- Data for Name: caregivers; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.caregivers (id, name, email, phone, password) FROM stdin;
1	Balogh Eszter	balogh.eszter@care.hu	06301234567	$2b$10$ZMt5cevB.aKs8mKwpR6qOOh5kGU6FnUcEiUiNyzVPA84cBRtrWhFa
2	Varga Zoltán	varga.zoltan@care.hu	06309876543	$2b$10$9VRfgIm8axdKk31uXnY73OXvubhyPVWDo23lP6B.TwnNYWvsq62jS
3	Molnár Ágnes	molnar.agnes@care.hu	06305432123	$2b$10$54gs2z5JC9Vgs.oXZv59ZuE2BQpDqcfmYHOxtAaf9DYhIlvtiBuS6
4	Fehér Dániel	feher.daniel@care.hu	06301112223	$2b$10$g8sMvXlWB8dGbhpczOwtx.dicZO9LAXj9LGA3gdnEOtiSzLhZtQ5a
5	Pintér Rita	pinter.rita@care.hu	06304445566	$2b$10$ULDPIGK8Nd0kT4vcPu2PTuziCtqKJRDCX1j1wxRukXSCKlOPMaqJ6
6	Bognár Márk	bognar.mark@care.hu	06303334455	$2b$10$vXIuQ3no934Xm9zxXRe7h.ystzSQhc6AHkXOLbWerwOheDvTmVEVG
7	Juhász Noémi	juhasz.noemi@care.hu	06306667788	$2b$10$jMmr9l40MldmDLps3gIDeeiXUQwr.2OkU91mji6omBWkJhyrdjLii
8	Kovács Péter	kovacs.peter@care.hu	06305556677	$2b$10$ZHIvHAX1qamApo5cjJrzceIxuyXQR.ZDBrpqbkISzT6534dtplmBu
9	Oláh Enikő	olah.eniko@care.hu	06302221133	$2b$10$3x/KEQ4fA9BDaq6B3qytlODr7ZRFZjqysHiQMIwaAfUOc8sWGyTPK
10	Tóth Gábor	toth.gabor@care.hu	06309998877	$2b$10$9PzqXtEsuwSm9aZdNkVWouCIvAE1HlrNHql.3j64anPqt9eVLHcJK
11	Kelemen Zsófia	kelemen.zsofia@care.hu	06307778899	$2b$10$KrtyqMVgTCtRpgRvIdPGK.Qmw3CBUGrpSKsS/qYSpZ1r8yT6s7suO
12	Lengyel Ádám	lengyel.adam@care.hu	06308889900	$2b$10$QnBKtMYSS10poeThrfqnEuH.mLaT1VARNyqos7tvxVNoyLSl9srsa
13	Takács Judit	takacs.judit@care.hu	06301110000	$2b$10$Yb6wmN9l6BzjWOM75/OFYePB8Mxp.jUn9/p/UScKKnk39Yvur8Gg.
14	Simon Réka	simon.reka@care.hu	06304443322	$2b$10$Oue.b7bTF.qYgGZQ78wTmeC5fHOlTVqNiIYmFZDcFzELZYoCMxA5G
15	Fekete Norbert	fekete.norbert@care.hu	06303332211	$2b$10$aZ9K08FBdOy9vy5u9hSMKuCZCgPojibxNqgfkVAdlEv6/JZXV1Yhi
16	Szűcs Laura	szucs.laura@care.hu	06302223344	$2b$10$s7s0lEkTEwYnpZai0cKH7.FrFlB2g5d4lmoVxxNCfPo6WGcsj9fAy
17	Kiss András	kiss.andras@care.hu	06301113355	$2b$10$uMzvxdkxtPaLnrHXU8IzeO129KX1EyV1gAX9by8wYnnL.RMYlW4e.
18	Soós Nikolett	soos.nikolett@care.hu	06309997766	$2b$10$9JQjvuIIuse67F88XblCa.IuuIhhk76DLmtlSfc05wp9I8dOObVYy
19	Tamás Bence	tamas.bence@care.hu	06306665544	$2b$10$88/HGKG7GPitBV089JNjEuaoHCwqenRhyIBOYaVhVCTywXM0Q9hFi
20	Barna Ildikó	barna.ildiko@care.hu	06305557799	$2b$10$EpPglVpYT.xYplfdAmDomupBVNL5fXJCtzKtg6jJHE9Rb27M5Z9Ii
21	Lukács Dóra	lukacs.dora@care.hu	06302229988	$2b$10$oVVt5pAXOcdr4AS1a5wZt.uxBfLeAO81TO1rLFb2hikplekA10bw6
22	Csabai Gábor	csabai.gabor@care.hu	06301112244	$2b$10$3vJDRkOtWqSWlqYIWArPXOGm4wtSF4C5yRIDpQvXg8ksPwWBlCOGa
23	Szalai Anett	szalai.anett@care.hu	06303335566	$2b$10$ichzWEIYkcd6x93Zqzfl8en5LfbLdaJnZtI2rrOlvvikaa/o0KLqm
24	Hegedűs Zsolt	hegedus.zsolt@care.hu	06304446677	$2b$10$dSVTp8d.emilQFo6Vrq2Y.aqSPEplnqysso2pVQ0Ph1DiXgMm89fy
25	Bíró Petra	biro.petra@care.hu	06306667711	$2b$10$gTMAvRTkWCkC1TzMxEslge1Fjp0c/FgXJIKi5FF5pjwzRMmOUFGsi
26	Papp Máté	papp.mate@care.hu	06309990001	$2b$10$2eU0fa8EYb9oo8ucPBaTc.JlUKfl7YeWdZUOVXPUBqwadQLX/2C4C
27	Török Szilvia	torok.szilvia@care.hu	06305554433	$2b$10$iWuIwznGdKLon4CG0XjyruT/BoF2t0nR0vSkWQFBshIJWzRK5LGOC
28	Vincze Krisztián	vincze.krisztian@care.hu	06301116688	$2b$10$ugDr.i1lqW0uhOY8Rpu5keCPVN6tUMVAiphSc1kVzJVX5hodg5KLu
29	Balla Emese	balla.emese@care.hu	06303334477	$2b$10$PvNbNQXmJs29BWaxnPaHFOFkU4rILnuDXpilqujPGhePwYkbaAZP6
30	Horváth Nóra	horvath.nora@care.hu	06304445599	$2b$10$k5gMlMfIDoC9XZVF6nsBiuH85LeRoKzk5IPort0K0iWmQ/DV.HhyO
31	Németh Kristóf	nemeth.kristof@care.hu	06306668822	$2b$10$2aeqwhnMQd//wsNenAwkVexlEXYqkQqlKTv75cxZP4zbVSUTuPmGC
32	Veres Piroska	veres.piroska@care.hu	06307779900	$2b$10$l5Qkf1Z3uiz1kuEMxF92Wer7Vs0uqla4JQ5ImFdORzPQ8piwiO7Cu
33	Benedek Erik	benedek.erik@care.hu	06308880011	$2b$10$2u.ZoDupfOtKOwp1Wd76nuF0F.ZDPpg0RuD6bVGWPRrBcl5ENImJC
34	Sárközi Lilla	sarkozi.lilla@care.hu	06309991122	$2b$10$51XX4p1a3CM7vjNalV/OW.yxXv8qE87chtrD1DpM0Bj3p4/FowuqG
35	Antal Bálint	antal.balint@care.hu	06301112277	$2b$10$sBI6Cd6ce.xrZ6I8Y74tqucvlx7835faMIeJS7CfwzAFuqsHqvoDK
36	Tímár Klaudia	timar.klaudia@care.hu	06302223366	$2b$10$5i7inECovOErXOQIEG68huiEOFKjZE4PptxsUu9BTY5T8RtSw8squ
37	György László	gyorgy.laszlo@care.hu	06303334411	$2b$10$K/qlHh40r/7.GGafT439IOLtNvESh6iELhNO6dbDCZembBQkj1s3S
38	Kádár Gréta	kadar.greta@care.hu	06304445588	$2b$10$aGeNvBDKQUcd/p4ei5sPo.TdXWIZ4k5MegmbXk06iajTJAt0rpOGa
39	Fábián Kitti	fabian.kitti@care.hu	06305556600	$2b$10$/CXAfGcIw0Etbr2foN9yhu/3MkDapXFBPRVq7HViF257FmjwWrmUW
40	Orbán Tamara	orban.tamara@care.hu	06306667733	$2b$10$62hQDK77MrUEEbyBREcGr.xG8FHgR31ZDAcufGvk65519Bo5PwKpO
41	Demeter Csaba	demeter.csaba@care.hu	06307778844	$2b$10$TrPAr.QdBe7YR3amFLaTSOrB.YkLbE6Xv0DlOk48WsFDAsNoPGmWK
42	Gulyás Alíz	gulyas.aliz@care.hu	06308889922	$2b$10$qvTMp3jIRafR4g/hjGuRL..X1/xZUmgApBstOPMpRwkfsBa2kmnPi
43	Béres Attila	beres.attila@care.hu	06309990033	$2b$10$P8Bu/BmbhavLfXGA4j1/F.j7589.4F3oeNS6gHdEtQJ.QIPqzSbke
44	Major Panna	major.panna@care.hu	06301110088	$2b$10$msa991x2K1C/z6mH1X1VvOqD64tZQk/60uevryKHJRggg1Ko4JB4a
45	Sipos Szilárd	sipos.szilard@care.hu	06302223377	$2b$10$xVoQ/mnvTNM3wXyvLbljeOH9SufqM3l30OgJSH8jQr.xry0SXwyEC
46	Borbás Melinda	borbas.melinda@care.hu	06303334400	$2b$10$Ob1cn7SmvzWa1wxKGpXF3OdzJC4teiamMb2YKvdqqJF7D0bDHI6SS
47	Mészáros Roland	meszaros.roland@care.hu	06304445522	$2b$10$IIBbc4qhZR48HtZ/tYEZsey0rK9dvQeKasKWa8Tj46CKIIZI.ECBC
48	László Tímea	laszlo.timea@care.hu	06305556611	$2b$10$wte1U6GE3D8xA8kJwVXNw.ClQhwi9xxnXkGlL4WsbIHZfWfL8uzm.
49	Kerekes Dóra	kerekes.dora@care.hu	06301112233	$2b$10$6z7Ui81u9RnEmHe7MI729Oy1RYxm5FBXthkXHFx25BQKF54xs9M0i
50	Barta Zoltán	barta.zoltan@care.hu	06302224455	$2b$10$TnhCGFmXRoi.SQh9qA7LQubq8ETJO/I4UGdQ/yITWa6HnVwNXrMfq
51	Fekete Noémi	fekete.noemi@care.hu	06303336677	$2b$10$BwIuksJb/LKRU9eVwhLB0emQGBZ3iVf00Xe9YX.HFGHrf.NuouIRy
\.


--
-- Data for Name: recipients; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.recipients (id, name, email, phone, address, four_hand_care_needed, caregiver_note, password) FROM stdin;
1	Kovács Erzsébet	kovacs.erzsebet@rec.hu	06305554433	Budapest, Bartók Béla út 5.	f		$2b$10$uM./b1N7zzXZ.0tEdA6Qe.zJDzzNfgB5BBcHZlfrJ0IixQa.EgOSK
2	Szabó János	szabo.janos@rec.hu	06304443322	Budapest, Petőfi utca 10.	t	Mozgássérült, emelni kell.	$2b$10$/liHg37GxihV6GXrRZmaLeAEaP04fYUARSC7iONm3b/Q2jBGNCrCa
3	Varga István	varga.istvan@rec.hu	06303332211	Budapest, Tisza Lajos körút 8.	f		$2b$10$paFXFLfrwKNVCJ9EsomJG.mILW/Exnohp1CsBRoKtLn6wrDa2DJLq
5	Kiss Gábor	kiss.gabor@rec.hu	06301110099	Budapest, Árpád út 2.	f	Hallássérült.	$2b$10$PuE1giLC0bBx83jPx7XxcuhXUQfm79zi64I.J0fESs.bR0/XXR.Ky
6	Nagy Géza	nagy.geza@rec.hu	06301112223	Budapest, Szent István út 1.	f		$2b$10$p0Mdd8QoE16w2o3OrBB6negk7PCTUoNAXy996u7lFd4l6vqDWMEBm
8	Molnár Kálmán	molnar.kalman@rec.hu	06303334455	Budapest, Deák tér 7.	t		$2b$10$hVYBp5.532MwqQazvz.HmOVEKOzWGS.Rp/liVL7lH4kGzspluJ8vy
9	Papp Margit	papp.margit@rec.hu	06304445566	Budapest, Batthyány utca 11.	f	Nem beszél.	$2b$10$FtPtYAOV.QBlTpEzdjilDOAACvmrVh3SLfyagq.qw0atTRZJJ1.1O
10	Bognár József	bognar.jozsef@rec.hu	06306667788	Budapest, Kossuth tér 9.	f		$2b$10$viJRJvabfto0TMaCFtYorOXjgt4aAGGcHmchleuPoOI4iAKIPn3zq
12	Balogh András	balogh.andras@rec.hu	06305550002	Budapest, Kálvin tér 2.	t	Gyalogosan nehéz megközelíteni.	$2b$10$yR8mlagaO4FSiNrG3dbAsePSE9jonnKfa80bk3v0C4.8yLarRShze
13	Lakatos Sára	lakatos.sara@rec.hu	06305550003	Budapest, Margit körút 20.	f		$2b$10$TVWjHTE3a2HrlTQt.uOd5eUjVaXYF3ZWsYchxZP0ETnaR8yTVGFRO
15	Bíró Anna	biro.anna@rec.hu	06305550005	Budapest, Lehel utca 5.	t	Naponta háromszor gyógyszer.	$2b$10$2qL.RXYM1JTlgzo7/KeWPuz5CxX2x22aqWRU5WbA.CB7vMhjtZkue
16	Gulyás László	gulyas.laszlo@rec.hu	06305550006	Budapest, Bécsi út 17.	f		$2b$10$d.CDVdsPMiFEc2A5i3Y6R.HgQB7iSBJ7IRiTCFJAI/uJcfiT7rxSy
18	Sipos Mihály	sipos.mihaly@rec.hu	06305550008	Budapest, Villányi út 12.	t	Állandó felügyelet kell.	$2b$10$snkx1mjjWPuyFexSaAbySOtoBcQZJnxeGGShymxrSTqv5zFapGmP.
19	Kelemen Veronika	kelemen.veronika@rec.hu	06305550009	Budapest, Alkotmány utca 8.	f		$2b$10$luLcdZ0WUi3hi2egGR6vxuSdnHST1xyFaf/MIrhJ2NMygMjjfnXhe
21	Oláh Mária	olah.maria@rec.hu	06305550011	Budapest, Jászai Mari tér 5.	t	Rendszeres vérnyomásmérés szükséges.	$2b$10$CU1HRxkjrq.mwhym/Wrj1.5QMELZCDp0HzgoHykuocohvKiQouViC
22	Németh Imre	nemeth.imre@rec.hu	06305550012	Budapest, Népfürdő utca 1.	f		$2b$10$O/ur8CUJrTryZ/.MrzvhxOsdMsVwTiCaXuyoRsmbOTBXCrLRggcY6
24	Pintér Gábor	pinter.gabor@rec.hu	06305550014	Budapest, Erzsébet körút 21.	f		$2b$10$hJuvHY4Qt1r1Fl8uKYPh9OMJG8Kaz/7ngvoI1tXhyI5bazB1T5vSy
25	Lukács Katalin	lukacs.katalin@rec.hu	06305550015	Budapest, Üllői út 50.	t	Szellemileg zavart.	$2b$10$MAKsK3yIjU1pOc2DubGlE.H0vSKoT64krB8qiUcg4Umg8qQxdgxeG
27	Simon Judit	simon.judit@rec.hu	06305550017	Budapest, Soroksári út 18.	f	Ágyhoz kötött.	$2b$10$YkgR9.Rbl/TyPgJbtJ7T3.aOkK.R5UOV.iaiKvADcvWQhmm3w3MH.
28	Katona Tamás	katona.tamas@rec.hu	06305550018	Budapest, Thököly út 6.	f		$2b$10$OeHA5baRbqJxDsEkAqYQkuI1cmD2UD/3UI.xdc8etaSOuH0X0mIEq
30	Balla Lászlóné	balla.laszlone@rec.hu	06305550020	Budapest, Kerepesi út 9.	f		$2b$10$rm0Eo2i3YukP1WGOMC1Td.LD7Er.c3qwv4HSLmxs34BBl2N7LF6Di
31	Sárközi Gergely	sarkozi.gergely@rec.hu	06305550021	Budapest, Váci út 66.	f		$2b$10$P4d2s0nQn5STarfl76Ra4OVOdOHW44IkamdamqxAtP/IzEftKr0TK
32	Molnár Zsuzsanna	molnar.zsuzsanna@rec.hu	06305550022	Budapest, Bajza utca 23.	t		$2b$10$Lr5IxKAAeGbbGLlw0Pwd2epmKrMTa9kNcvWwal6wpnc2oMiyA9AN.
34	Jakab Laura	jakab.laura@rec.hu	06305550024	Budapest, Rétköz utca 15.	f		$2b$10$g46L0PVwTOINMCIEh.TTj.c6430GTwk6olqWGImKrGQSGNuKMG7CW
35	Vass Csaba	vass.csaba@rec.hu	06305550025	Budapest, Andrássy út 12.	t	Időszakos felügyelet kell.	$2b$10$xcMmpLDd8/AB59ZzKxly4.m7ScNLRDXth7rhyZPzFhncIqomH1ATe
36	Horváth Júlia	horvath.julia@rec.hu	06305550026	Budapest, Pozsonyi út 16.	f		$2b$10$UF9GXdSjjtXDkDcGGCx2CeToMqZ.55pYLqxQrza1VuCtjqzSJZdGe
38	Kádár Lili	kadar.lili@rec.hu	06305550028	Budapest, Tétényi út 5.	t		$2b$10$mHNAspHR.FfZDZ4uvLxj5.GurtUopHVjK0aAe6l4gLkA.fYYvzwE6
39	Bognár Ádám	bognar.adam@rec.hu	06305550029	Budapest, Nagymező utca 8.	f		$2b$10$f.yMepdMCZi2wG5U1oPWR.OZ7I4oON4ij6xK35xzEmw6oQ7fjRjSm
41	Barta Róbert	barta.robert@rec.hu	06305550031	Budapest, Béla király útja 2.	t	Demens, figyelni kell rá.	$2b$10$u44HetKu3Ss426jBk6Sx6uumb3HKX8XYqinZC7v.ZCw0Coq9BV7RW
42	Kis Judit	kis.judit@rec.hu	06305550032	Budapest, Tímár utca 11.	f		$2b$10$1I7g1C.RzUZWW1AB35Ywhe3MFI9TXEwOt76EiLNwaAnACBNze3DZ.
44	Béres Nóra	beres.nora@rec.hu	06305550034	Budapest, Hegedűs Gyula utca 20.	f		$2b$10$XpJ5ZiT1392FOEMK.ATIsO1a7RjmjZYPC8k0iV52g4hKcMshYW.Oy
46	Veres Klára	veres.klara@rec.hu	06305550036	Budapest, Klauzál tér 6.	f		$2b$10$6nXMZb9gmRnG.ig8683vZODTKvNje6/cQarVIxKRlqdzKdwP/6mYi
47	Weisz Tamás	weisz.tamas@rec.hu	06305550037	Budapest, Lónyay utca 21.	f		$2b$10$BfAOpOUUwfej17UeC5OpLOIB5SQ579tS0bwvnOzbl1AIozrm3xN2m
48	Halász Petra	halasz.petra@rec.hu	06305550038	Budapest, Vámház körút 15.	t		$2b$10$APv3JT54N.qjWynnl2di.eijwn6PVoOgVMbNNgcVOWgB3m15/F6Je
49	Oláh Gábor	olah.gabor@rec.hu	06305550039	Budapest, Haller utca 4.	f		$2b$10$ztjc11iIBO9BWRthBzi4L.sTqTEiHnYnJkr2zCFosqg2sRLdssf6y
51	Major László	major.laszlo@rec.hu	06305550041	Budapest, Dózsa György út 19.	f		$2b$10$I3bTc5Y6Z0lR84H/tDwgh.NMYj3oMw5SO6UjYnWDIFT42XlshhgK.
52	Jaksa Márta	jaksa.marta@rec.hu	06305550042	Budapest, Mester utca 42.	f		$2b$10$9KjIQrCrx4/msfDnOX/1Tu05AQ8UQapovjsA3OMHZDBfLQx1CAadm
54	Kovácsné Edit	kovacsne.edit@rec.hu	06305550044	Budapest, Garay utca 14.	f		$2b$10$KBj6BXXAt.7W78Qro9aCC.XlzwncpfDCBIvSe5mYMTHK8DRBC0lBG
55	Takács Zsolt	takacs.zsolt@rec.hu	06305550045	Budapest, Wesselényi utca 6.	f		$2b$10$6809oYkJhvxcSoRL5uncuudsqYjqPSsYFLTRXTe8t7N9B6ACPCu6W
57	Sebők Dóra	sebok.dora@rec.hu	06305550047	Budapest, Rumbach Sebestyén utca 10.	f		$2b$10$sNzPc/x4xui.bqNKBdUMIupMOAd6WbRYqtGd5seB4S7MXTUsQgZPq
58	Fekete Kristóf	fekete.kristof@rec.hu	06305550048	Budapest, Akácfa utca 4.	f		$2b$10$nMScKpJGnOeq0F.maiSF3eOlbTg3LC0GaD/M5X/N4SdYJZcc08Qdu
60	Tari Ferenc	tari.ferenc@rec.hu	06305550050	Budapest, Holló utca 1.	t		$2b$10$9HeyjmtZNtYNbdLTzHl0megV5Z4AyDnDP2zyAsz6UMpWg5obv7DkC
4	Tóth Mária	toth.maria@rec.hu	06302221100	Budapest, Rákóczi út 3.	t	Naponta kétszer kell gyógyszer.	$2b$10$t3E5wt87xYU7d2mi14yBt./z.FTFbAUZWxtFgEydrdBaq4iExILgO
7	Fehér Lászlóné	feher.laszlone@rec.hu	06302223344	Budapest, Dobó tér 4.	f	Időben kell etetni.	$2b$10$ZUecrKvNfthQhviYNn3NuOJitG95ELZof1UjLABOkD4RIfIP0aaDm
11	Fekete Ilona	fekete.ilona@rec.hu	06305550001	Budapest, Arany János utca 1.	f		$2b$10$9cn8bID5gf89sigw8vOshORwV3zKN4.st87wFEP.sZmlZJn/eG0Qu
14	Fodor Zoltán	fodor.zoltan@rec.hu	06305550004	Budapest, Hunyadi tér 3.	f	Cukorbeteg, diéta fontos.	$2b$10$ArgDI5awj3pdZjKlE8jOVuhjNu5yfLVMNLOzHaO9ecAFwXfJ00O4S
17	Szalai Réka	szalai.reka@rec.hu	06305550007	Budapest, Budaörsi út 22.	f		$2b$10$g1uIXh9ygLWaUR/4qFD4sOpisuXedV087HiRNKbIEJ2rEnIC30v1G
20	Török Dénes	torok.denes@rec.hu	06305550010	Budapest, Zsigmond tér 10.	f		$2b$10$CwEkAUEUaY2HzgkFE/HH7OGcFU2M82e6cR8jPDPYGPEANQgRCmTnG
23	Tóth Ágnes	toth.agnes2@rec.hu	06305550013	Budapest, Csalogány utca 4.	f		$2b$10$xEfTcyp54tnp11Xy8OmypOD9gwROkCqmGcFm/qaOmAFgOxWjSYslG
26	Takács Attila	takacs.attila@rec.hu	06305550016	Budapest, Fehérvári út 3.	f		$2b$10$j41LXtGNSfdvdctqmXzjges4CSPD6BQfczoMt.xtYk..FiTSUMchS
29	Major Eszter	major.eszter@rec.hu	06305550019	Budapest, Bajcsy-Zsilinszky út 33.	t	Ételallergia: mogyoró.	$2b$10$2hRBvGTdQpcFi9LpWctT1eEF5OfeI3zbQkj8EoXwqu1jghRtuWd3W
33	Kiss András	kiss.andras2@rec.hu	06305550023	Budapest, Lövőház utca 2.	f		$2b$10$TjH5.fhI5y3sqtfH7nhDfOJ8PW7jdyo/1n4L6Sk1au/hn0RlBPGaW
37	Farkas Gyula	farkas.gyula@rec.hu	06305550027	Budapest, Lágymányosi utca 7.	f		$2b$10$i/6jYhCzBbt1mi9rI9s5V.WJnxYqsnRuK1fK6ZZbxPz5kzEmqt/Hy
40	Szentpéteri Erika	szentpeteri.erika@rec.hu	06305550030	Budapest, Béke utca 19.	f		$2b$10$82mDg/XwGptCP9KWqUUMHebrssp02KcRjci4LS.IiPM6G/l0GMVzK
43	Somogyi Zsolt	somogyi.zsolt@rec.hu	06305550033	Budapest, Göncz Árpád városközpont 3.	f		$2b$10$dBYPLaAACqru2wRpJepp8OJYoqM56rUIng2hSKng07viDPfEFIKQi
45	Szentgyörgyi Dániel	szentgyorgyi.daniel@rec.hu	06305550035	Budapest, Madách tér 1.	t	Érzékeny az erős fényre.	$2b$10$qYbY8Lp2ovXKIP5dCDhaEuRpT5y4/Pw.qjpG7.jq00IW5uDTIJLrq
50	Hajnal Nóra	hajnal.nora@rec.hu	06305550040	Budapest, Czuczor utca 9.	f		$2b$10$LqSkO3UEM552e/9Q0vQZBOMWs104agJIVYzPtWxIohxGCZiTMYlfa
53	Révész Imre	revesz.imre@rec.hu	06305550043	Budapest, Hősök tere 1.	t		$2b$10$obsf/3dV4fKvLsdt/Pqu5u1yVDwW4O.cj6YlI9cWvZDETIDMvFm4.
56	Vincze Beáta	vincze.beata@rec.hu	06305550046	Budapest, Király utca 8.	t		$2b$10$nSW6agYWWdHS0Zh4EW7cyuZgJbbkUg.5aqGRoNtGJAY19BhxcJ0Da
59	Nagy Bernadett	nagy.bernadett@rec.hu	06305550049	Budapest, Dob utca 5.	f		$2b$10$vitxU.TINQK5gF0tceBDKOfAbtRa2nAtYWLNntZG.HclNIQHEjjpK
\.


--
-- Data for Name: recipients_caregivers; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.recipients_caregivers (relationship_id, recipient_id, caregiver_id) FROM stdin;
1	1	1
2	2	1
3	3	1
4	4	1
5	5	1
6	6	33
7	7	41
8	8	25
9	9	13
10	10	6
11	11	2
12	12	48
13	13	39
14	14	9
15	15	26
16	16	15
17	17	18
18	18	22
19	19	30
20	20	3
21	21	36
22	22	20
23	23	29
24	24	10
25	25	1
26	26	46
27	27	17
28	28	11
29	29	14
30	30	35
31	31	50
32	32	38
33	33	31
34	34	24
35	35	21
36	36	37
37	37	34
38	38	43
39	39	27
40	40	8
41	41	44
42	42	49
43	43	4
44	44	45
45	45	32
46	46	47
47	47	40
48	48	42
49	49	23
50	50	16
51	51	9
52	52	6
53	53	12
54	54	19
55	55	5
56	56	22
57	57	28
58	58	36
59	59	33
60	60	13
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.schedules (id, relationship_id, date, start_time, end_time) FROM stdin;
3	3	2025-06-02	13:00:00	14:30:00
4	4	2025-06-07	13:00:00	15:00:00
6	6	2025-06-10	09:00:00	11:00:00
7	7	2025-06-06	08:30:00	10:30:00
8	8	2025-06-01	11:00:00	13:00:00
10	7	2025-06-03	15:00:00	17:00:00
11	6	2025-06-11	08:00:00	10:00:00
12	7	2025-06-04	10:00:00	12:00:00
13	8	2025-06-06	09:00:00	11:00:00
14	9	2025-06-02	14:00:00	16:00:00
15	9	2025-06-13	08:00:00	10:00:00
16	10	2025-06-05	12:00:00	14:00:00
17	11	2025-06-03	09:00:00	11:00:00
18	11	2025-06-12	15:00:00	17:00:00
19	12	2025-06-07	08:30:00	10:30:00
20	13	2025-06-01	14:00:00	16:00:00
21	14	2025-06-08	13:00:00	15:00:00
22	15	2025-06-04	08:00:00	10:00:00
23	15	2025-06-10	10:00:00	12:00:00
24	16	2025-06-03	09:30:00	11:30:00
25	17	2025-06-06	14:00:00	16:00:00
26	18	2025-06-05	12:30:00	14:30:00
27	18	2025-06-11	10:00:00	12:00:00
28	19	2025-06-07	08:00:00	10:00:00
29	20	2025-06-02	15:00:00	17:00:00
30	21	2025-06-09	09:00:00	11:00:00
31	21	2025-06-13	14:00:00	16:00:00
32	22	2025-06-01	08:30:00	10:30:00
33	23	2025-06-06	13:00:00	15:00:00
34	23	2025-06-12	09:00:00	11:00:00
35	24	2025-06-04	11:00:00	13:00:00
37	26	2025-06-02	10:30:00	12:30:00
38	27	2025-06-03	14:00:00	16:00:00
39	28	2025-06-05	13:00:00	15:00:00
40	28	2025-06-14	08:00:00	10:00:00
41	29	2025-06-01	10:00:00	12:00:00
42	30	2025-06-07	09:00:00	11:00:00
43	30	2025-06-15	14:00:00	16:00:00
44	31	2025-06-06	08:30:00	10:30:00
45	32	2025-06-08	12:00:00	14:00:00
46	33	2025-06-09	08:00:00	10:00:00
47	34	2025-06-04	09:00:00	11:00:00
48	35	2025-06-10	13:00:00	15:00:00
49	36	2025-06-11	10:00:00	12:00:00
50	36	2025-06-13	08:30:00	10:30:00
51	37	2025-06-05	11:00:00	13:00:00
52	38	2025-06-03	14:30:00	16:30:00
53	39	2025-06-07	09:00:00	11:00:00
54	40	2025-06-08	08:00:00	10:00:00
55	41	2025-06-06	10:30:00	12:30:00
56	42	2025-06-09	12:00:00	14:00:00
57	43	2025-06-14	09:00:00	11:00:00
58	44	2025-06-13	13:00:00	15:00:00
59	45	2025-06-12	10:00:00	12:00:00
60	46	2025-06-10	08:30:00	10:30:00
9	5	2025-06-09	12:00:00	14:00:00
36	25	2025-06-10	08:00:00	10:00:00
5	5	2025-06-05	15:30:00	17:00:00
2	2	2025-06-05	10:30:00	12:00:00
1	1	2025-06-05	08:00:00	10:00:00
\.


--
-- Data for Name: task_types; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.task_types (id, type) FROM stdin;
1	Szociális segítség
2	Személyi gondozás
\.


--
-- Data for Name: subtasks; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.subtasks (id, title, tasktypeid) FROM stdin;
1	Bevásárlás	1
2	Mosogatás	1
3	Mosdatás	2
4	Étkeztetés	2
5	Folyadékpótlás	2
6	Vérnyomásmérés	2
\.


--
-- Data for Name: todo; Type: TABLE DATA; Schema: public; Owner: postgres_felhasznalo
--

COPY public.todo (id, subtaskid, relationshipid, sequencenumber, done) FROM stdin;
1	1	1	1	f
2	2	1	2	f
3	3	1	3	f
4	4	1	4	f
5	5	1	5	f
6	6	1	6	f
7	1	2	1	f
8	2	2	2	f
9	3	2	3	f
10	4	2	4	f
11	5	2	5	f
12	6	2	6	f
13	1	3	1	f
14	2	3	2	f
15	3	3	3	f
16	4	3	4	f
17	5	3	5	f
18	6	3	6	f
19	1	4	1	f
20	2	4	2	f
21	3	4	3	f
22	4	4	4	f
23	5	4	5	f
24	6	4	6	f
25	1	5	1	f
26	2	5	2	f
27	3	5	3	f
28	4	5	4	f
29	5	5	5	f
30	6	5	6	f
31	1	6	1	f
32	2	6	2	f
33	3	6	3	f
34	4	6	4	f
35	5	6	5	f
36	6	6	6	f
37	1	7	1	f
38	2	7	2	f
39	3	7	3	f
40	4	7	4	f
41	5	7	5	f
42	6	7	6	f
43	1	8	1	f
44	2	8	2	f
45	3	8	3	f
46	4	8	4	f
47	5	8	5	f
48	6	8	6	f
49	1	9	1	f
50	2	9	2	f
51	3	9	3	f
52	4	9	4	f
53	5	9	5	f
54	6	9	6	f
55	1	10	1	f
56	2	10	2	f
57	3	10	3	f
58	4	10	4	f
59	5	10	5	f
60	6	10	6	f
61	1	11	1	f
62	2	11	2	f
63	3	11	3	f
64	4	11	4	f
65	5	11	5	f
66	6	11	6	f
67	1	12	1	f
68	2	12	2	f
69	3	12	3	f
70	4	12	4	f
71	5	12	5	f
72	6	12	6	f
73	1	13	1	f
74	2	13	2	f
75	3	13	3	f
76	4	13	4	f
77	5	13	5	f
78	6	13	6	f
79	1	14	1	f
80	2	14	2	f
81	3	14	3	f
82	4	14	4	f
83	5	14	5	f
84	6	14	6	f
85	1	15	1	f
86	2	15	2	f
87	3	15	3	f
88	4	15	4	f
89	5	15	5	f
90	6	15	6	f
91	1	16	1	f
92	2	16	2	f
93	3	16	3	f
94	4	16	4	f
95	5	16	5	f
96	6	16	6	f
97	1	17	1	f
98	2	17	2	f
99	3	17	3	f
100	4	17	4	f
101	5	17	5	f
102	6	17	6	f
103	1	18	1	f
104	2	18	2	f
105	3	18	3	f
106	4	18	4	f
107	5	18	5	f
108	6	18	6	f
109	1	19	1	f
110	2	19	2	f
111	3	19	3	f
112	4	19	4	f
113	5	19	5	f
114	6	19	6	f
115	1	20	1	f
116	2	20	2	f
117	3	20	3	f
118	4	20	4	f
119	5	20	5	f
120	6	20	6	f
121	1	21	1	f
122	2	21	2	f
123	3	21	3	f
124	4	21	4	f
125	5	21	5	f
126	6	21	6	f
127	1	22	1	f
128	2	22	2	f
129	3	22	3	f
130	4	22	4	f
131	5	22	5	f
132	6	22	6	f
133	1	23	1	f
134	2	23	2	f
135	3	23	3	f
136	4	23	4	f
137	5	23	5	f
138	6	23	6	f
139	1	24	1	f
140	2	24	2	f
141	3	24	3	f
142	4	24	4	f
143	5	24	5	f
144	6	24	6	f
145	1	25	1	f
146	2	25	2	f
147	3	25	3	f
148	4	25	4	f
149	5	25	5	f
150	6	25	6	f
151	1	26	1	f
152	2	26	2	f
153	3	26	3	f
154	4	26	4	f
155	5	26	5	f
156	6	26	6	f
157	1	27	1	f
158	2	27	2	f
159	3	27	3	f
160	4	27	4	f
161	5	27	5	f
162	6	27	6	f
163	1	28	1	f
164	2	28	2	f
165	3	28	3	f
166	4	28	4	f
167	5	28	5	f
168	6	28	6	f
169	1	29	1	f
170	2	29	2	f
171	3	29	3	f
172	4	29	4	f
173	5	29	5	f
174	6	29	6	f
175	1	30	1	f
176	2	30	2	f
177	3	30	3	f
178	4	30	4	f
179	5	30	5	f
180	6	30	6	f
181	1	31	1	f
182	2	31	2	f
183	3	31	3	f
184	4	31	4	f
185	5	31	5	f
186	6	31	6	f
187	1	32	1	f
188	2	32	2	f
189	3	32	3	f
190	4	32	4	f
191	5	32	5	f
192	6	32	6	f
193	1	33	1	f
194	2	33	2	f
195	3	33	3	f
196	4	33	4	f
197	5	33	5	f
198	6	33	6	f
199	1	34	1	f
200	2	34	2	f
201	3	34	3	f
202	4	34	4	f
203	5	34	5	f
204	6	34	6	f
205	1	35	1	f
206	2	35	2	f
207	3	35	3	f
208	4	35	4	f
209	5	35	5	f
210	6	35	6	f
211	1	36	1	f
212	2	36	2	f
213	3	36	3	f
214	4	36	4	f
215	5	36	5	f
216	6	36	6	f
217	1	37	1	f
218	2	37	2	f
219	3	37	3	f
220	4	37	4	f
221	5	37	5	f
222	6	37	6	f
223	1	38	1	f
224	2	38	2	f
225	3	38	3	f
226	4	38	4	f
227	5	38	5	f
228	6	38	6	f
229	1	39	1	f
230	2	39	2	f
231	3	39	3	f
232	4	39	4	f
233	5	39	5	f
234	6	39	6	f
235	1	40	1	f
236	2	40	2	f
237	3	40	3	f
238	4	40	4	f
239	5	40	5	f
240	6	40	6	f
241	1	41	1	f
242	2	41	2	f
243	3	41	3	f
244	4	41	4	f
245	5	41	5	f
246	6	41	6	f
247	1	42	1	f
248	2	42	2	f
249	3	42	3	f
250	4	42	4	f
251	5	42	5	f
252	6	42	6	f
253	1	43	1	f
254	2	43	2	f
255	3	43	3	f
256	4	43	4	f
257	5	43	5	f
258	6	43	6	f
259	1	44	1	f
260	2	44	2	f
261	3	44	3	f
262	4	44	4	f
263	5	44	5	f
264	6	44	6	f
265	1	45	1	f
266	2	45	2	f
267	3	45	3	f
268	4	45	4	f
269	5	45	5	f
270	6	45	6	f
271	1	46	1	f
272	2	46	2	f
273	3	46	3	f
274	4	46	4	f
275	5	46	5	f
276	6	46	6	f
277	1	47	1	f
278	2	47	2	f
279	3	47	3	f
280	4	47	4	f
281	5	47	5	f
282	6	47	6	f
283	1	48	1	f
284	2	48	2	f
285	3	48	3	f
286	4	48	4	f
287	5	48	5	f
288	6	48	6	f
289	1	49	1	f
290	2	49	2	f
291	3	49	3	f
292	4	49	4	f
293	5	49	5	f
294	6	49	6	f
295	1	50	1	f
296	2	50	2	f
297	3	50	3	f
298	4	50	4	f
299	5	50	5	f
300	6	50	6	f
301	1	51	1	f
302	2	51	2	f
303	3	51	3	f
304	4	51	4	f
305	5	51	5	f
306	6	51	6	f
307	1	52	1	f
308	2	52	2	f
309	3	52	3	f
310	4	52	4	f
311	5	52	5	f
312	6	52	6	f
313	1	53	1	f
314	2	53	2	f
315	3	53	3	f
316	4	53	4	f
317	5	53	5	f
318	6	53	6	f
319	1	54	1	f
320	2	54	2	f
321	3	54	3	f
322	4	54	4	f
323	5	54	5	f
324	6	54	6	f
325	1	55	1	f
326	2	55	2	f
327	3	55	3	f
328	4	55	4	f
329	5	55	5	f
330	6	55	6	f
331	1	56	1	f
332	2	56	2	f
333	3	56	3	f
334	4	56	4	f
335	5	56	5	f
336	6	56	6	f
337	1	57	1	f
338	2	57	2	f
339	3	57	3	f
340	4	57	4	f
341	5	57	5	f
342	6	57	6	f
343	1	58	1	f
344	2	58	2	f
345	3	58	3	f
346	4	58	4	f
347	5	58	5	f
348	6	58	6	f
349	1	59	1	f
350	2	59	2	f
351	3	59	3	f
352	4	59	4	f
353	5	59	5	f
354	6	59	6	f
355	1	60	1	f
356	2	60	2	f
357	3	60	3	f
358	4	60	4	f
359	5	60	5	f
360	6	60	6	f
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.admins_id_seq', 7, true);


--
-- Name: caregivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.caregivers_id_seq', 51, true);


--
-- Name: recipients_caregivers_relationship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.recipients_caregivers_relationship_id_seq', 60, true);


--
-- Name: recipients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.recipients_id_seq', 60, true);


--
-- Name: schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.schedules_id_seq', 60, true);


--
-- Name: subtasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.subtasks_id_seq', 6, true);


--
-- Name: task_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.task_types_id_seq', 2, true);


--
-- Name: todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres_felhasznalo
--

SELECT pg_catalog.setval('public.todo_id_seq', 360, true);


--
-- PostgreSQL database dump complete
--

